import type { HimringOperationId } from '@himring/sdk'

export const INDEX_RECORD_RESOURCE_DESCRIPTIONS: Readonly<Record<string, string>> = {
  records: 'List, read, write, delete, and import the records of a search index.',
}

const INDEX = '--index ix_8c4b2a0f1e3d5c7b9a8f6e4d2c0b1a3f'

export const INDEX_RECORD_EXAMPLES = {
  update_index: [
    `himring indexes update ${INDEX} --language french`,
    `himring indexes update ${INDEX} --bm25-file bm25.json --synonyms-file synonyms.json`,
    `himring indexes update ${INDEX} --stop-words-file stop-words.json`,
  ],
  preview_index_search: [
    `himring indexes preview-search ${INDEX} --query "refund policy"`,
    `himring indexes preview-search ${INDEX} --query refunds --mode keyword --output json`,
    `himring indexes preview-search ${INDEX} --query refunds --offset 20 --limit 20`,
    `himring indexes preview-search ${INDEX} --query "refnd polcy" --tolerance 2 --boosts title:3,body:1 --term-match all`,
    `himring indexes preview-search ${INDEX} --query refunds --group-by topic --group-size 2 --facet-ranges-file ranges.json`,
  ],
  compare_index_search: [
    `himring indexes compare-search ${INDEX} --query "refund policy" --boosts title:3`,
    `himring indexes compare-search ${INDEX} --query refunds --mode keyword --bm25-file bm25.json --output json`,
  ],
  get_index_stats: [`himring indexes stats ${INDEX}`, `himring indexes stats ${INDEX} --output json`],
  suggest_index_terms: [
    `himring indexes suggest ${INDEX} --prefix refu`,
    `himring indexes suggest ${INDEX} --prefix ship --limit 5 --output json`,
  ],
  list_index_records: [
    `himring records list ${INDEX} --search refunds`,
    `himring records list ${INDEX} --filters '{"fields":{"category":{"eq":"billing"}}}' --output json`,
  ],
  export_index_records: [
    `himring records export ${INDEX}`,
    `himring records export ${INDEX} --out articles.ndjson --force`,
  ],
  get_index_record: [
    `himring records get ${INDEX} --record article-1042`,
    `himring records get ${INDEX} --record article-1042 --output json`,
  ],
  save_index_record: [
    `himring records save ${INDEX} --record article-1042 --record-file article.json`,
    `cat article.json | himring records save ${INDEX} --record article-1042 --record-file -`,
  ],
  delete_index_record: [
    `himring records delete ${INDEX} --record article-1042 --yes`,
    `himring records delete ${INDEX} --record article-1042 --dry-run`,
  ],
} as const satisfies Partial<Record<HimringOperationId, readonly string[]>>
