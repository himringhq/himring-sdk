package tests

import (
	"io"
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
	"sync"
	"testing"
	"time"
)

type rawReply struct {
	status  int
	body    []byte
	headers map[string]string
	delay   time.Duration
	drip    time.Duration
	cutAt   int
}

type arrivedRequest struct {
	method  string
	path    string
	headers map[string]string
	body    []byte
}

type standIn struct {
	server       *httptest.Server
	baseURL      string
	mutex        sync.Mutex
	replies      map[string][]rawReply
	arrivals     []arrivedRequest
	inFlight     int
	mostInFlight int
}

func newStandIn(t testing.TB) *standIn {
	t.Helper()
	server := &standIn{replies: map[string][]rawReply{}}
	server.server = httptest.NewServer(http.HandlerFunc(server.answer))
	server.baseURL = server.server.URL
	t.Cleanup(server.server.Close)
	return server
}

func (server *standIn) script(method string, path string, replies ...rawReply) {
	server.mutex.Lock()
	defer server.mutex.Unlock()
	server.replies[method+" "+path] = replies
}

func (server *standIn) arrived(method string) []arrivedRequest {
	server.mutex.Lock()
	defer server.mutex.Unlock()
	var matching []arrivedRequest
	for _, request := range server.arrivals {
		if method == "" || request.method == method {
			matching = append(matching, request)
		}
	}
	return matching
}

func (server *standIn) peakInFlight() int {
	server.mutex.Lock()
	defer server.mutex.Unlock()
	return server.mostInFlight
}

func (server *standIn) nextReply(method string, path string) rawReply {
	server.mutex.Lock()
	defer server.mutex.Unlock()
	queue := server.replies[method+" "+path]
	if len(queue) == 0 {
		if method == http.MethodPut {
			return rawReply{status: http.StatusOK}
		}
		return rawReply{status: http.StatusNotFound}
	}
	reply := queue[0]
	if len(queue) > 1 {
		server.replies[method+" "+path] = queue[1:]
	}
	return reply
}

func (server *standIn) answer(writer http.ResponseWriter, request *http.Request) {
	server.mutex.Lock()
	server.inFlight++
	server.mostInFlight = max(server.mostInFlight, server.inFlight)
	server.mutex.Unlock()
	defer func() {
		server.mutex.Lock()
		server.inFlight--
		server.mutex.Unlock()
	}()
	body, _ := io.ReadAll(request.Body)
	headers := map[string]string{}
	for name, values := range request.Header {
		headers[strings.ToLower(name)] = strings.Join(values, ", ")
	}
	server.mutex.Lock()
	server.arrivals = append(server.arrivals, arrivedRequest{method: request.Method, path: request.URL.Path, headers: headers, body: body})
	server.mutex.Unlock()
	reply := server.nextReply(request.Method, request.URL.Path)
	select {
	case <-time.After(reply.delay):
	case <-request.Context().Done():
		return
	}
	for name, value := range reply.headers {
		writer.Header().Set(name, value)
	}
	writer.Header().Set("content-length", strconv.Itoa(len(reply.body)))
	writer.WriteHeader(reply.status)
	flusher, _ := writer.(http.Flusher)
	switch {
	case reply.cutAt > 0:
		writer.Write(reply.body[:reply.cutAt])
		flusher.Flush()
		if hijacker, canHijack := writer.(http.Hijacker); canHijack {
			if connection, _, err := hijacker.Hijack(); err == nil {
				connection.Close()
			}
		}
	case reply.drip > 0:
		for index := range reply.body {
			writer.Write(reply.body[index : index+1])
			flusher.Flush()
			select {
			case <-time.After(reply.drip):
			case <-request.Context().Done():
				return
			}
		}
	default:
		writer.Write(reply.body)
	}
}
