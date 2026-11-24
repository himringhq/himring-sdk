# Contributing to the Himring SDKs

This repository holds the public clients of the [Himring](https://himring.ai) API: the TypeScript SDK, the Python SDK, the Go SDK, the Rust SDK, the CLI, the MCP server, and the hooks for LiveKit and Pipecat agents. Every client is generated from the same OpenAPI documents, so a change usually starts in the spec or in a generator and then shows up in each client.

## Code of conduct

This project follows the [Contributor Covenant](./CODE_OF_CONDUCT.md). You can report unacceptable behavior to support@himring.ai.

## What you need

- Node.js 24, the version in `.node-version`
- pnpm 11, which corepack installs from the `packageManager` field of `package.json`
- [uv](https://docs.astral.sh/uv/), which installs the Python that each Python project needs
- [Go](https://go.dev/dl/) 1.26 or later, for the Go SDK
- [rustup](https://rustup.rs), which installs the Rust toolchain that `sdks/rust/rust-toolchain.toml` pins
- Git

Clone the repository and install the Node packages from the root:

```bash
pnpm install
```

The Python targets call `uv run --frozen`, so uv creates each virtual environment from its `uv.lock` the first time that a target calls it. The Rust targets call `cargo` with `--locked`, so cargo builds from the committed `Cargo.lock` and fails when the lockfile would have to change.

## How the repository fits together

| Folder | Nx project | What it holds |
| --- | --- | --- |
| `spec/` | `spec` | A copy of the `openapi.json` and `openapi-session.json` documents of the pinned `@himring/openapi` release |
| `sdks/typescript/` | `sdk-typescript` | `@himring/sdk`, with its generator in `codegen/` and its generated code in `src/generated/` |
| `sdks/python/` | `sdk-python` | `himring`, with its generator in `codegen/` and its generated code in `src/himring/_generated/` |
| `sdks/go/` | `sdk-go` | The `github.com/himringhq/himring-sdk/sdks/go` module, with its generator in `codegen/` and its generated code in the `*_gen.go` files |
| `sdks/rust/` | `sdk-rust` | The `himring` crate, with its generator in `codegen/` and its generated code in `src/generated/` |
| `packages/cli/` | `cli` | `@himring/cli`, the `himring` command |
| `packages/mcp-server/` | `mcp-server` | `@himring/mcp-server`, the `himring-mcp` command |
| `packages/agent-hooks-python/` | `agent-hooks-python` | `himring-agent-hooks`, for LiveKit and Pipecat agents |
| `tools/contract-server/` | `contract-server` | A stand-in for the Himring API, built from the documents in `spec/` |
| `tools/release/` | `release` | The scripts that version and tag a release, stage each npm package for a maintainer to approve, and tag the Go module as `sdks/go/vX.Y.Z` |
| `.github/scripts/` | `repository-gates` | The dependency age gate and the supply-chain gate that CI runs |

### The spec

`spec/package.json` pins one exact version of `@himring/openapi`, and `pnpm exec nx run spec:sync` copies that version's documents into `spec/`. The `spec:validate` target fails when `spec/` differs from the pinned release, so you can change the documents only by pinning a newer release and running the sync. A scheduled workflow opens that pull request when npm has a newer release.

The documents carry values that a client needs beyond the JSON Schema under `x-himring-` keys, such as the byte limit of each upload, the extension of each download, and the API key permissions of each operation. The clients read those values from the documents, so client code holds no copy of a limit, an enum, or a file extension.

### Code generation

Each SDK has a `generate` target, which writes the generated code from the documents in `spec/`, and a `generate:check` target, which fails when the committed code differs from what the generator writes. Edit the generator and run `generate`, because CI rejects a hand edit to `src/generated/`, `_generated/`, or a `*_gen.go` file.

```bash
pnpm exec nx run sdk-typescript:generate
pnpm exec nx run sdk-python:generate
pnpm exec nx run sdk-go:generate
pnpm exec nx run sdk-rust:generate
```

### Tests against the contract server

The tests exercise each package through its public interface: the SDK clients, the `himring` and `himring-mcp` commands, and the agent hooks. They run against `tools/contract-server`, which checks every request that a client sends and every answer that a test scripts against the documents in `spec/`, so a test fails when a client sends a field that the spec doesn't define. Each test checks the answer against an independent oracle, such as the spec read directly or the requests that the contract server recorded.

Write each test from the side of a hostile user, who sends malformed input, crosses every limit, chooses bad settings, and mixes writes with restarts. Add a test only when it catches a defect that can hurt a customer or leak data.

## Commands

Nx starts every target. Run several targets across every project, one project's target, or only the projects that your branch changed:

```bash
pnpm exec nx run-many -t validate generate:check lint typecheck build test
pnpm exec nx run sdk-python:test
pnpm exec nx affected -t validate generate:check lint typecheck build test --base=origin/main
```

| Target | What it does |
| --- | --- |
| `validate` | Checks that `spec/` matches the pinned `@himring/openapi` release |
| `generate:check` | Checks that the generated code matches the spec |
| `lint` | Biome for TypeScript, ruff for Python, `gofmt` with `go mod tidy -diff` for Go, and rustfmt with clippy for Rust |
| `format` | Applies the Biome, ruff, `gofmt`, and rustfmt fixes and formatting |
| `typecheck` | `tsc` from TypeScript 7 for TypeScript, pyright for Python, `go vet` for Linux, macOS, and Windows for Go, and `cargo check` for Rust |
| `build` | tsup for the npm packages, with `tsc` writing the declarations of `@himring/sdk`, `uv build` for the Python packages, `go build` for the Go module, and `cargo package` for the crate |
| `test` | Vitest for TypeScript, pytest for Python, `go test -race` for Go, and `cargo test` for Rust |

## Code style

- Biome formats and lints TypeScript with single quotes, semicolons only where they're required, and a 120-character line.
- Ruff formats and lints Python with a 100-character line, and pyright checks its types.
- `gofmt` formats Go, and `go vet` checks it.
- Rustfmt formats Rust with its default 100-character line, and clippy lints it with the pedantic group, warnings as errors, and no `unsafe` code.
- Files carry no comments, so names hold the information that a comment would.
- TypeScript has no `any`, no non-null assertion, and no `@ts-ignore` or `@ts-expect-error`, and Python has no `Any` and no `type: ignore`.
- The JSON fields that the clients send and return, the CLI's JSON output, and the MCP server's tool arguments and results are in lowercase snake_case, which is the case of the API.
- Each hand-written source file stays under 400 lines.
- Install a Node package with `pnpm add -E` from inside the project that needs it, a Python package with `uv add` from inside the Python project, a Go module with `go get` from inside `sdks/go`, and a crate with `cargo add` from inside `sdks/rust`.

## Pull requests

Create a branch from `main`, and write each commit message as a one-line conventional commit, such as `fix(cli): refuse an upload larger than the documented limit`. Run the affected targets before you open the pull request, then fill in the template. CI checks the affected projects, audits the workflows with zizmor, scans the history for secrets with gitleaks, and refuses dependency versions that are less than four days old.

Treat everything that you commit as public, so mention no internal system, private repository, machine, or person in code, tests, or commit messages, and build stand-in credentials from repeated text.

## Reporting issues

Report a bug or request a feature in [GitHub Issues](https://github.com/himringhq/himring-sdk/issues). For a bug, include the package and its version, the steps that reproduce it, what you expected, and what happened.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](./LICENSE).
