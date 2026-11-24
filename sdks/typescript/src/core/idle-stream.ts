export function idleLimitedStream(
  source: ReadableStream<Uint8Array>,
  idleTimeoutMs: number,
  stalled: () => Error,
  signal?: AbortSignal,
): ReadableStream<Uint8Array> {
  const reader = source.getReader()
  let timer: ReturnType<typeof setTimeout> | undefined
  let stopForCaller: (() => void) | undefined

  function release(): void {
    clearTimeout(timer)
    if (stopForCaller !== undefined) signal?.removeEventListener('abort', stopForCaller)
  }

  function nextChunk(): ReturnType<typeof reader.read> {
    return new Promise((resolve, reject) => {
      timer = setTimeout(() => {
        const error = stalled()
        reader.cancel(error).catch(() => undefined)
        reject(error)
      }, idleTimeoutMs)
      reader.read().then(resolve, reject)
    })
  }

  return new ReadableStream<Uint8Array>(
    {
      start(controller) {
        stopForCaller = () => {
          release()
          reader.cancel(signal?.reason).catch(() => undefined)
          controller.error(signal?.reason)
        }
        signal?.addEventListener('abort', stopForCaller, { once: true })
        if (signal?.aborted === true) stopForCaller()
      },
      async pull(controller) {
        try {
          signal?.throwIfAborted()
          const read = await nextChunk()
          signal?.throwIfAborted()
          if (read.done) {
            release()
            controller.close()
          } else controller.enqueue(read.value)
        } catch (error) {
          release()
          throw error
        } finally {
          clearTimeout(timer)
        }
      },
      cancel(reason) {
        release()
        return reader.cancel(reason)
      },
    },
    { highWaterMark: 0 },
  )
}
