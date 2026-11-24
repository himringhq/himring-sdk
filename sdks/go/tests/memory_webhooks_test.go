package tests

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"reflect"
	"strconv"
	"strings"
	"testing"
	"time"

	himring "github.com/himringhq/himring-sdk/sdks/go"
)

const webhookSecret = "whsec_memory_test"

var (
	signedAt     = time.Date(2026, 11, 24, 9, 30, 0, 0, time.UTC)
	webhookEvent = map[string]any{
		"id": "evt_1", "type": "memory.decision.applied", "created_at": "2026-11-24T09:30:00.000Z", "project_id": projectID,
		"memory_id": "mem_1", "decision": map[string]any{"id": "dec_1", "memory_id": "mem_1", "kind": "kept", "reason": "Confirmed twice."},
	}
)

func webhookBody(t testing.TB, event map[string]any) []byte {
	t.Helper()
	body, err := json.Marshal(event)
	if err != nil {
		t.Fatal(err)
	}
	return body
}

func signatureOf(body []byte, secret string, at time.Time) string {
	timestamp := strconv.FormatInt(at.Unix(), 10)
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(timestamp + "."))
	mac.Write(body)
	return "t=" + timestamp + ",v1=" + hex.EncodeToString(mac.Sum(nil))
}

func rejectionOf(t testing.TB, body []byte, signature string, now time.Time) himring.MemoryWebhookRejection {
	t.Helper()
	_, err := himring.VerifyMemoryWebhook(himring.MemoryWebhook{Body: body, Signature: signature, Secret: webhookSecret, Now: now})
	var rejected *himring.MemoryWebhookRejected
	if !errors.As(err, &rejected) {
		t.Fatalf("the webhook was not rejected: %v", err)
	}
	return rejected.Reason
}

func TestReturnsTheEventWhenHimringSignedTheBodyEvenWhileTheSecretRotates(t *testing.T) {
	body := webhookBody(t, webhookEvent)
	old := strings.Split(signatureOf(body, "whsec_old", signedAt), ",")[1]
	for _, header := range []string{signatureOf(body, webhookSecret, signedAt), signatureOf(body, webhookSecret, signedAt) + "," + old, old + "," + signatureOf(body, webhookSecret, signedAt)} {
		event, err := himring.VerifyMemoryWebhook(himring.MemoryWebhook{Body: body, Signature: header, Secret: webhookSecret, Now: signedAt.Add(300 * time.Second)})
		if err != nil {
			t.Fatal(err)
		}
		if event.ID != "evt_1" || event.MemoryID != "mem_1" || !reflect.DeepEqual(event.Decision, webhookEvent["decision"]) {
			t.Fatalf("the event is %+v", event)
		}
	}
}

func TestRejectsABodyOrSignatureThatHimringDidNotProduce(t *testing.T) {
	body := webhookBody(t, webhookEvent)
	valid := signatureOf(body, webhookSecret, signedAt)
	timestamp := "t=" + strconv.FormatInt(signedAt.Unix(), 10)
	cases := map[string][2]string{
		"changed body":       {strings.Replace(string(body), "kept", "dropped", 1), valid},
		"other secret":       {string(body), signatureOf(body, "whsec_attacker", signedAt)},
		"uppercase digest":   {string(body), strings.ToUpper(valid)},
		"no digest":          {string(body), timestamp},
		"two timestamps":     {string(body), valid + "," + timestamp},
		"non-ASCII digit":    {string(body), strings.Replace(valid, "t=", "t=١", 1)},
		"oversized header":   {string(body), valid + "," + strings.Repeat("x", 4_096)},
		"no timestamp":       {string(body), "v1=" + strings.Repeat("0", 64)},
		"negative timestamp": {string(body), strings.Replace(valid, "t=", "t=-", 1)},
	}
	for name, input := range cases {
		if reason := rejectionOf(t, []byte(input[0]), input[1], signedAt); reason != himring.MemoryWebhookSignatureInvalid {
			t.Fatalf("%s was rejected as %s", name, reason)
		}
	}
	for _, header := range []string{"", "   "} {
		if reason := rejectionOf(t, body, header, signedAt); reason != himring.MemoryWebhookSignatureMissing {
			t.Fatalf("%q was rejected as %s", header, reason)
		}
	}
	for _, offset := range []time.Duration{301 * time.Second, -301 * time.Second} {
		if reason := rejectionOf(t, body, valid, signedAt.Add(offset)); reason != himring.MemoryWebhookTimestampOutsideTolerance {
			t.Fatalf("an offset of %s was rejected as %s", offset, reason)
		}
	}
}

func TestRejectsASignedBodyThatIsNotAMemoryEvent(t *testing.T) {
	withDecision := func(decision any) map[string]any {
		event := map[string]any{}
		for key, value := range webhookEvent {
			event[key] = value
		}
		event["decision"] = decision
		return event
	}
	emptyID := withDecision(webhookEvent["decision"])
	emptyID["id"] = ""
	bodies := [][]byte{
		[]byte("\xff\xfe not utf-8"), []byte("[]"), []byte(`{"id": "evt_1", "value": NaN}`), []byte(`{"id": "evt_1"} {"id": "evt_2"}`),
		webhookBody(t, withDecision(nil)), webhookBody(t, emptyID), webhookBody(t, withDecision(map[string]any{"id": "dec_1", "memory_id": "mem_1"})),
	}
	for _, body := range bodies {
		if reason := rejectionOf(t, body, signatureOf(body, webhookSecret, signedAt), signedAt); reason != himring.MemoryWebhookEventInvalid {
			t.Fatalf("%q was rejected as %s", body, reason)
		}
	}
}

func TestRefusesSettingsThatWouldAcceptAnything(t *testing.T) {
	body := webhookBody(t, webhookEvent)
	for _, received := range []himring.MemoryWebhook{
		{Body: body, Signature: signatureOf(body, "", signedAt), Secret: "", Now: signedAt},
		{Body: body, Signature: signatureOf(body, webhookSecret, signedAt), Secret: webhookSecret, Tolerance: -time.Second, Now: signedAt},
	} {
		event, err := himring.VerifyMemoryWebhook(received)
		var rejected *himring.MemoryWebhookRejected
		if err == nil || errors.As(err, &rejected) || event != nil {
			t.Fatalf("the settings %+v returned %v, %v", received, event, err)
		}
	}
}
