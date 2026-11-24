#!/usr/bin/env node
import { runCli } from './program.js'
import { readStandardInputOnce } from './standard-input.js'

function writeStdout(text: string): void {
  process.stdout.write(text)
}

function writeStderr(text: string): void {
  process.stderr.write(text)
}

process.exitCode = await runCli(
  process.argv,
  {
    writeStdout,
    writeStderr,
    readStdin: readStandardInputOnce(process.stdin),
    stdinIsTerminal: process.stdin.isTTY === true,
  },
  process.env,
)
