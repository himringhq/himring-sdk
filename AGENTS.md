# Working in this repository

This repository holds the public clients of the Himring API: the TypeScript and Python SDKs, the CLI, the MCP server, and the agent hooks, all generated from the OpenAPI documents in `spec/`.

Read the file that you're editing and follow what it already does. The rules below cover what that reading leaves out.

## Rules

- Re-read and apply the developer's writing guidelines fully, if available, whenever you write any prose in the repo, and write that prose in American English.
- Keep every hand-written source file under 400 lines. Measure a file when you touch it, and split it before your change pushes it over.
- Write no comments in any file, including tests and config files. Put the information into names instead.
- Write no `any`, no non-null assertion, and no `@ts-ignore` or `@ts-expect-error` in TypeScript, and no `Any` and no `type: ignore` in Python; narrow the type instead.
- Change `spec/` only by pinning a newer `@himring/openapi` and running `pnpm exec nx run spec:sync`, and change `src/generated` and `_generated` only by running each SDK's `generate` target, because CI fails when either one differs from the pinned release.
- Read every limit, enum, file extension, byte cap, and key permission from the spec, and copy none of them into client code, because a copied value stays fixed when the API changes it.
- Write the JSON fields that the clients send and return, the CLI's JSON output, and the MCP server's tool arguments and results in lowercase snake_case, which is the case of the API.
- Install a Node package with `pnpm add -E` from inside the target workspace, and a Python package with `uv add` from inside the Python workspace, and leave the dependency blocks of `package.json` and `pyproject.toml` alone otherwise.
- Lint and format Python with ruff, check its types with pyright, and test it with pytest, through the targets that each project defines.
- Test each feature only through end-to-end tests on the public interface of each package (the SDK clients, the CLI, the MCP server, and the agent hooks), run against `tools/contract-server` and written from the side of a hostile user who sends malformed input, reaches and crosses every limit, chooses bad settings, and mixes writes with restarts. Check every answer against an independent oracle that shares no code with the package, such as the spec read directly or the requests that the contract server recorded.
- Treat everything that you commit as public. Mention no internal system, private repository, machine, path, or person in code, tests, commit messages, or pull requests. Create temporary folders under the system temp directory, and build stand-in credentials from repeated text, so that the gitleaks scan in CI passes.
- Propose every capability done properly. Read how established products solve it and what this repository already does, then propose that, and where ease of implementation is your real reason for a narrower version, say so in those words.
- Before you build or change anything, ask "how does the industry do this in production?" and build that answer, within the spec and the decisions already made, which are final.
- Run the lint, typecheck, build, and test targets of every project that you touched, along with `generate:check` when you touched a generator, before you report a change done.

## Agent skills

### Issue tracker

Issues live as GitHub issues on `himringhq/himring-sdk`, and every operation runs through the `gh` CLI.
