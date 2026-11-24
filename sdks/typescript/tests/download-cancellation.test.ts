import { expect, it } from 'vitest'
import { createHimringClient } from '../src/index.js'
import { idOf, refusalOf, useHarness } from './support/harness.js'

const harness = useHarness()

it('bounds a download refusal whose JSON body never finishes', async () => {
  const projectId = idOf('prj')
  const indexId = idOf('ix')
  harness.storage.handle(`/v1/projects/${projectId}/indexes/${indexId}/download`, (_request, response) => {
    response.writeHead(403, { 'content-type': 'application/json' })
    response.write('{"error":')
  })
  const client = createHimringClient({ baseUrl: harness.storage.origin, timeoutMs: 100 })
  const started = Date.now()
  const error = await refusalOf(client.downloadIndex({ project_id: projectId, index_id: indexId }))
  expect(error).toMatchObject({ status: 403 })
  expect(Date.now() - started).toBeLessThan(2_000)
})

it.each(['api', 'storage'])('cancels a %s download while its next chunk is pending', async destination => {
  const projectId = idOf('prj')
  const indexId = idOf('ix')
  const path = `/v1/projects/${projectId}/indexes/${indexId}/download`
  harness.storage.handle(path, (_request, response) => {
    response.writeHead(200, { 'content-type': 'application/octet-stream' })
    response.write('first chunk')
  })
  harness.api.stub('get_download_link', {
    status: 200,
    body: {
      url: `${harness.storage.origin}${path}`,
      expires_at: '2026-11-25T09:00:00.000Z',
      file_name: 'report.pdf',
      content_type: 'application/pdf',
      disposition: 'attachment',
      size_bytes: 100,
      entity_tag: '"v1"',
    },
  })
  const client = createHimringClient({ baseUrl: harness.storage.origin })
  const controller = new AbortController()
  const options = { signal: controller.signal }
  const download =
    destination === 'api'
      ? await client.downloadIndex({ project_id: projectId, index_id: indexId }, options)
      : await harness.client.downloadFile(
          { project_id: projectId, knowledge_base_id: idOf('kb'), file_id: idOf('fil'), version: 1 },
          options,
        )
  const reader = download.body.getReader()
  expect((await reader.read()).value).toEqual(new TextEncoder().encode('first chunk'))
  const pending = reader.read()
  controller.abort()
  await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
})
