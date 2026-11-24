import { startContractServer } from './server.js'

const server = await startContractServer({ control: true })
process.stdout.write(`${JSON.stringify({ base_url: server.baseUrl })}\n`)

let stopping = false
async function stop(): Promise<void> {
  if (stopping) return
  stopping = true
  await server.stop()
  process.exit(0)
}

process.stdin.on('end', () => void stop())
process.stdin.on('close', () => void stop())
process.stdin.resume()
process.on('SIGTERM', () => void stop())
process.on('SIGINT', () => void stop())
