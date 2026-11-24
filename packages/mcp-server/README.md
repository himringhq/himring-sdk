# @himring/mcp-server

`@himring/mcp-server` gives an AI agent every operation of the [Himring](https://himring.ai) API as a tool, over the stdio transport of the Model Context Protocol. Your agent can search a knowledge base, send files and folders to it, manage databases and indexes, and read the Memory of a project.

```bash
npm install --global @himring/mcp-server
```

The server needs Node.js 22 or later, and its command is `himring-mcp`.

## Add it to your MCP client

Most MCP clients take a command and an environment. This configuration runs the server with an API key of one project, and it lets the agent read files only from one folder and write downloads only into another:

```json
{
  "mcpServers": {
    "himring": {
      "command": "himring-mcp",
      "env": {
        "HIMRING_API_KEY": "hk_...",
        "HIMRING_UPLOAD_DIRECTORY": "/srv/himring/policies",
        "HIMRING_DOWNLOAD_DIRECTORY": "/srv/himring/downloads"
      }
    }
  }
}
```

The server reads these environment variables when it starts, and it refuses to start when one of them is invalid:

| Variable                     | What it sets                                                                                                            |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `HIMRING_API_KEY`            | The API key that the server sends with every request. It wins when you also set a session token.                        |
| `HIMRING_SESSION_TOKEN`      | The session of an account, for the tools that need a person, such as creating an API key.                               |
| `HIMRING_API_URL`            | The address of the API, by default `https://api.himring.ai`.                                                            |
| `HIMRING_API_TIMEOUT_MS`     | How long one request may wait for an answer, and how long a download may go without a byte, by default 30 seconds.      |
| `HIMRING_UPLOAD_DIRECTORY`   | The absolute path of the only folder that the file tools read from, by default the folder where the server starts.      |
| `HIMRING_DOWNLOAD_DIRECTORY` | The absolute path of the only folder that the download tools write into, by default the folder where the server starts. |

## The tools

The server offers one tool for each operation in the OpenAPI documents that this repository publishes, under the operation's ID, such as `search_knowledge_base` or `list_databases`. Each tool takes the operation's path parameters, query parameters, and body fields together in their snake_case names, and its description says which credential it needs and which permission an API key needs for it. The server leaves out the sign-in steps, because an agent should never handle a password, and it marks the tools that delete or replace data as destructive.

A list field such as `state` takes an array or the comma-separated text that the API documents, and a number field such as `limit` takes a number or its text. The server checks every argument against the JSON Schema of the operation before it sends a request, and it refuses an argument that breaks the schema without calling the API.

Seven tools go beyond a single request:

- `get_status` reports whether the API and the services behind it are ready.
- `add_file` sends one file from the upload folder to a knowledge base, straight to storage through links that Himring signs.
- `upload_folder` sends every file of a folder that Himring reads, skips the files that the knowledge base already holds, and reports progress when the request carries a progress token.
- `download_file` writes one version of a file of a knowledge base into the download folder.
- `import_saved_questions`, `import_index_records`, and `import_answer_log` send a file from the upload folder as the body of the operation of the same name.

## Files and folders

The file tools read only from the upload folder. They refuse an absolute path, a path that leads outside the folder, a symbolic link that points outside it, and a hidden file or folder. Each import tool refuses a file larger than the maximum that the OpenAPI documents give for its operation before it sends a byte.

The download tools write only into the download folder, under a plain file name that ends in the extension that the documents give for the download, such as `.nrsl` for `download_index`. They never replace a file or write through a symbolic link that holds the name, and they give each file owner-only permissions. Each download goes to a hidden temporary file first and takes its name only once every byte has arrived, so a download that fails or stalls leaves no file under the name.

## Errors

A tool that fails answers with `isError` and text that starts with an error code, such as `project_not_found: The project does not exist.`, so that an agent can branch on the code. Most codes come from the API. The server adds `upload_refused` and `download_refused` for a local path that it refuses, `invalid_response` for an answer that breaks the documented schema, and `timeout` and `network` when no answer came. When an API key lacks a permission, the result also carries `missing_permission`. The server never shows its credential to the agent or writes it to its log, even when an API repeats it back.
