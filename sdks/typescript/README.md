# @himring/sdk

`@himring/sdk` is the TypeScript client of the [Himring](https://himring.ai) API, which lets AI agents answer from what a business knows. It has one method for every operation of the API, with types generated from the published OpenAPI documents, so a field that the API renames will fail your build instead of failing in production.

```bash
npm install @himring/sdk
```

The package works in Node.js 22.12 or later and in any runtime that has `fetch` and Web Crypto. It ships both ES modules and CommonJS, so you can load every entry with `import` or with `require`. The `@himring/sdk/answers` and `@himring/sdk/folders` entries need Node.js, because they write to the disk.

## Make a client

```ts
import { createHimringClient } from '@himring/sdk'

const himring = createHimringClient({ credential: process.env.HIMRING_API_KEY })

const { passages } = await himring.searchKnowledgeBase({
  project_id: 'prj_0f3c9a7d5e1b42c6a8d4e2f19b7c6a30',
  knowledge_base_id: 'kb_6e2a1c9f4b8d47e3a5c0d9f2b1e7a463',
  question: 'How long do refunds take?',
})
```

The client calls `https://api.himring.ai`, the first server that the OpenAPI documents list, unless you pass `baseUrl`. Each method takes one object that holds the operation's path parameters, query parameters, and body fields together, in the snake_case names of the API. The client refuses a field that the operation does not take, and an ID such as `..` that would reach another path, before it sends anything.

`createHimringClient` also takes `timeoutMs`, which defaults to 30 seconds per request, `uploadIdleTimeoutMs`, which defaults to two minutes without progress during a file transfer, `headers` for headers of your own, and `fetch` to replace the global one. Pass `{ signal, timeoutMs }` as the second argument of any method to cancel that one call or to give it another deadline. `withCredential` and `withHeaders` return a copy of the client with another key or more headers.

## Handle errors

Every failure is a `HimringApiError`. Its `kind` is `refused` when the API answered with an error, `network` or `timeout` when no answer came, `invalid_response` when the answer broke the documented schema, and `invalid_input` when the client refused your input before sending it. A refusal carries the HTTP `status`, the documented `code`, the `issues` of each refused field, `missingPermission` when the API key lacks a permission, and `retryAfterSeconds` when the API asks you to wait.

```ts
import { isRefusal } from '@himring/sdk'

try {
  await himring.getKnowledgeBase({ project_id, knowledge_base_id })
} catch (error) {
  if (isRefusal(error, 'knowledge_base_not_found')) return undefined
  throw error
}
```

`describeError` turns any error into one line that names the reason and each refused field.

## Send and read files

`addFile` sends a file through an upload. The API signs links to the object store, the client sends the bytes straight to the store in parts, checks each part, and waits until the API confirms the file. Pass a `Blob`, a `Uint8Array`, or a source that reads byte ranges, such as an open file. The client never sends your credential to the object store, and it never follows a redirect.

```ts
const added = await himring.addFile({
  project_id,
  knowledge_base_id,
  path: 'policies/refunds.pdf',
  content: new Blob([bytes]),
})
```

`downloadFile` returns a `Download`, whose `body` is a stream of the file's bytes and whose `file_name` comes from the API. Pass `file_name` through `safeDownloadName` before you write it to the disk, because it holds whatever name the file had when someone uploaded it.

## Sync a folder

`@himring/sdk/folders` is the folder sync that the Himring CLI and MCP server use, and you can call it from your code as well. `syncFolder` walks a folder and sends each file that Himring reads to a knowledge base under its path inside the folder. It skips a file whose content the knowledge base already holds, and it leaves hidden files, symbolic links, and files of other kinds on your machine. With `deleteMissing`, it also deletes each file of the knowledge base that the folder no longer holds, and `dryRun` lists what it would send and delete without changing anything.

```ts
import { syncFolder } from '@himring/sdk/folders'

const report = await syncFolder({
  client: himring,
  projectId: project_id,
  knowledgeBaseId: knowledge_base_id,
  root: './policies',
})
for (const file of report.files) console.log(file.path, file.outcome)
```

The extensions that Himring reads, the longest path that it takes, and the size of each page of the file list come from the OpenAPI documents. `uploadLocalFile` sends one file, and `saveDownload` writes a `Download` to a path without replacing a file that exists, removing the partial file when the transfer fails.

## Record what your agent answers

`@himring/sdk/answers` records each answer, citation, follow-up, thumbs-down, and handoff of your agent, so that Himring can show which questions your knowledge base answers badly. The recorder batches events in memory and on the disk, so a restart or an outage of the API loses none of them.

```ts
import { createAnswerRecorder } from '@himring/sdk/answers'

const recorder = createAnswerRecorder({ client: himring, projectId: project_id, knowledgeBaseId: knowledge_base_id })
const conversation = recorder.conversation({ endUserId: 'customer-1042' })
const result = await conversation.search({ question: 'How long do refunds take?' })
conversation.recordAnswer('Refunds take five business days.', { citedChunkIds: [result.passages[0]?.chunk_id ?? ''] })
await recorder.close()
```

## Verify memory webhooks

`verifyMemoryWebhook` checks the `himring-signature` header of a webhook from a Himring Memory against your signing secret, and it refuses a body that someone changed and a delivery older than five minutes.

## Read the catalogue

`@himring/sdk/catalogue` exports `HIMRING_OPERATION_CATALOGUE`, which gives the summary, the access, the API key permissions, and the JSON Schema of the input and the output of every operation, and `HIMRING_ERROR_MESSAGES`, which gives the usual message of every error code. The main entry leaves them out, so that a bundle that never reads them stays small.
