# @himring/cli

`@himring/cli` installs the `himring` command, which runs the operations of the [Himring](https://himring.ai) API from a shell or a script. It builds the flags and input checks of each command from the operation catalogue that `@himring/sdk` generates from the OpenAPI documents of the API, so its limits match the API that it calls.

```bash
npm install --global @himring/cli
himring --help
```

The CLI works in Node.js 22 or later.

## Sign in or use an API key

Set `HIMRING_API_KEY` to the key of a project, and every command sends it. To sign in as a person, pipe the password so that it stays out of your shell history:

```bash
printf '%s' "$PASSWORD" | himring auth sign-in --email owner@example.com --password-stdin --code 123456
```

The CLI keeps the session in `credentials.json` inside `HIMRING_CONFIG_DIR`, or inside `$XDG_CONFIG_HOME/himring` or `~/.config/himring` when that variable is unset. It writes the file readable only by you, and it files each session under the API address that issued it, so it never sends a stored session to another address. `himring auth sign-out` ends the session and removes it from the file.

## Run a command

Commands take the shape `himring <resource> <verb>`, and each field of the operation becomes a flag. A field that ends in `_id` drops the suffix, so `knowledge_base_id` becomes `--knowledge-base`, and a field that holds JSON takes a file, or `-` for stdin, through a flag that ends in `-file`.

```bash
export HIMRING_PROJECT=prj_0f3c9a7d5e1b42c6a8d4e2f19b7c6a30
himring knowledge-bases search --knowledge-base kb_6e2a1c9f4b8d47e3a5c0d9f2b1e7a463 --question "How long do refunds take?"
himring indexes create --name articles --config-file articles.json
himring files upload --knowledge-base kb_6e2a1c9f4b8d47e3a5c0d9f2b1e7a463 --folder ./policies --dry-run
```

The CLI checks every input against the schema of its operation before it sends anything. A file that holds more bytes than the operation takes, a list limit above its maximum, or an ID that would change the request path fails at once with exit code 2, and no request leaves your machine. Commands such as `projects delete` and `files upload --delete` need `--yes`, and the commands that change records take `--dry-run`, which shows the request without sending it.

## Read the output

The CLI prints readable text by default. Pass `--output json` to receive one JSON object on the last line of stdout, with `status`, `data`, `error`, and `metadata` fields. A failure carries `error.code`, `error.message`, and `error.suggestion`, and `error.missing_permission` when an API key lacks a permission. The CLI refuses an answer that breaks the documented schema with the code `invalid_response`, and its text output shows control characters from an answer as visible escapes.

The exit code tells a script what happened: 0 for success, 2 for invalid input, 3 for a credentials file that it cannot read or write, 4 for a record that does not exist, 5 for a missing or refused credential, 6 for a conflict, 7 for a rate limit, 10 when the API cannot be reached, 11 when a service behind the API is not ready, 12 when the API failed, and 13 when only some files of a folder were sent. `himring --help` lists them in full.

## Download files

`himring indexes download`, `himring files download`, and the export commands write the file under the name that the API gives, cleaned so that it stays inside the current folder, or to the path that you pass with `--out`. The CLI writes to a temporary file next to the target and moves it into place only when the whole file has arrived, so a download that you stop with Ctrl-C, that stalls, or that the connection cuts short leaves nothing behind. It refuses to replace a file that exists unless you pass `--force`.

## Environment

| Variable | Use |
| --- | --- |
| `HIMRING_API_URL` | The address of the API, in place of `--api-url`. The default is the first server of the OpenAPI documents. |
| `HIMRING_API_TIMEOUT_MS` | How long each request may take, in place of `--timeout-ms`. |
| `HIMRING_API_KEY` | The API key of a project, in place of a session. |
| `HIMRING_SESSION_TOKEN` | A session token, in place of the credentials file. |
| `HIMRING_PROJECT` | The project ID, in place of `--project`. |
| `HIMRING_PASSWORD` | The password, in place of `--password-stdin`. |
| `HIMRING_CONFIG_DIR` | The folder of `credentials.json`. |
