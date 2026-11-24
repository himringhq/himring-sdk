# Himring SDKs

This repository holds the clients of the [Himring](https://himring.ai) API, which lets AI agents answer from what a business knows. Every client is generated from the same OpenAPI documents, so the TypeScript SDK, the Python SDK, the Rust SDK, the CLI, and the MCP server accept the same fields and enforce the same limits as the API.

| Package | Install | Source |
| --- | --- | --- |
| TypeScript SDK | `npm install @himring/sdk` | [`sdks/typescript`](./sdks/typescript) |
| Python SDK | `pip install himring` | [`sdks/python`](./sdks/python) |
| Rust SDK | `cargo add himring` | [`sdks/rust`](./sdks/rust) |
| Command-line interface | `npm install --global @himring/cli` | [`packages/cli`](./packages/cli) |
| MCP server | `npx @himring/mcp-server` | [`packages/mcp-server`](./packages/mcp-server) |
| Hooks for LiveKit and Pipecat agents | `pip install himring-agent-hooks` | [`packages/agent-hooks-python`](./packages/agent-hooks-python) |

Each package's README covers installation, authentication, and examples.

## Where the spec comes from

The Himring API publishes its OpenAPI documents to npm as [`@himring/openapi`](https://www.npmjs.com/package/@himring/openapi). `spec/package.json` pins one exact version, and `spec/` holds a copy of that version's `openapi.json` and `openapi-session.json`, so that every change to the documents arrives as a reviewed diff. Every day, a scheduled workflow checks npm for a newer version, copies its documents into `spec/`, regenerates every SDK, runs every test, and opens a pull request.

The documents carry values that a client needs beyond the JSON Schema, under `x-himring-` keys: the byte limit of each file upload, the extension of each download, the API key permissions of each operation, and the file kinds that Himring reads. The SDKs, the CLI, and the MCP server read those values from the documents and copy none of them.

## Work on the code

You need Node.js 24, pnpm 11, [uv](https://docs.astral.sh/uv/), and [rustup](https://rustup.rs). Install the Node packages from the root:

```bash
pnpm install
```

Nx runs every target. Run one target in every project, or one project's target:

```bash
pnpm exec nx run-many -t lint typecheck build test
pnpm exec nx run sdk-python:test
```

`pnpm exec nx run spec:sync` copies the documents of the pinned `@himring/openapi` into `spec/`, and `pnpm exec nx run-many -t generate` regenerates every SDK from them. CI fails when `spec/` differs from the pinned release or when a generated file differs from what the spec produces. The tests run against `tools/contract-server`, a stand-in API built from the documents, which checks every request that a client sends and every answer that a test scripts.

## License

[MIT](./LICENSE)
