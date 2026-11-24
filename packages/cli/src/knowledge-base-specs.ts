import type { HimringOperationId } from '@himring/sdk'
import type { CommandSpec } from './operation-specs.js'

export const KNOWLEDGE_BASE_RESOURCE_DESCRIPTIONS: Readonly<Record<string, string>> = {
  'knowledge-bases': 'Create, read, change, delete, restore, and search the knowledge bases of a project.',
  files: 'Send files and folders to a knowledge base, and list, read, delete, and restore its files.',
  metadata: 'List the metadata keys and values that the files of a knowledge base carry, to filter a search by.',
  questions: 'List the questions that a knowledge base answered, with the passages that it returned.',
  'end-users': 'Erase every question that one end user asked.',
}

const KB = '--knowledge-base kb_3f9a0c1e2d4b6a8c0e2f4a6b8c0d2e4f'
const FILE = '--file fil_0a1b2c3d4e5f60718293a4b5c6d7e8f9'

export const KNOWLEDGE_BASE_COMMANDS = {
  create_knowledge_base: {
    resource: 'knowledge-bases',
    verb: 'create',
    examples: [
      'himring knowledge-bases create --name "Support policies"',
      'himring knowledge-bases create --name Handbook --language french --chunk-tokens 800 --output json',
      'himring knowledge-bases create --name "Support policies" --question-log-retention-days 0',
    ],
  },
  list_knowledge_bases: {
    resource: 'knowledge-bases',
    verb: 'list',
    examples: [
      'himring knowledge-bases list --search support --sort name --direction asc',
      'himring knowledge-bases list --state deleted --sort purge_after --direction asc --output json',
    ],
  },
  get_knowledge_base: {
    resource: 'knowledge-bases',
    verb: 'get',
    examples: [`himring knowledge-bases get ${KB}`, `himring knowledge-bases get ${KB} --output json`],
  },
  update_knowledge_base: {
    resource: 'knowledge-bases',
    verb: 'update',
    confirm: true,
    examples: [
      `himring knowledge-bases update ${KB} --question-log-retention-days 90 --yes`,
      `himring knowledge-bases update ${KB} --question-log-retention-days unlimited --dry-run`,
    ],
  },
  delete_knowledge_base: {
    resource: 'knowledge-bases',
    verb: 'delete',
    confirm: true,
    examples: [`himring knowledge-bases delete ${KB} --yes`, `himring knowledge-bases delete ${KB} --dry-run`],
  },
  restore_knowledge_base: {
    resource: 'knowledge-bases',
    verb: 'restore',
    examples: [`himring knowledge-bases restore ${KB}`, `himring knowledge-bases restore ${KB} --output json`],
  },
  search_knowledge_base: {
    resource: 'knowledge-bases',
    verb: 'search',
    examples: [
      `himring knowledge-bases search ${KB} --question "How long do refunds take?"`,
      `himring knowledge-bases search ${KB} --question "Opening hours" --limit 3 --end-user customer-42 --output json`,
      `himring knowledge-bases search ${KB} --question "Travel allowance" --folder policies/travel --metadata-file filter.json`,
    ],
  },
  answer_question: {
    resource: 'knowledge-bases',
    verb: 'answer',
    examples: [
      `himring knowledge-bases answer ${KB} --question "How long do refunds take?"`,
      `himring knowledge-bases answer ${KB} --question "Travel allowance" --folder policies/travel --output json`,
    ],
  },
  list_files: {
    resource: 'files',
    verb: 'list',
    examples: [
      `himring files list ${KB} --status failed`,
      `himring files list ${KB} --search policies/ --sort path --direction asc --output json`,
    ],
  },
  list_folder: {
    resource: 'files',
    verb: 'folder',
    examples: [
      `himring files folder ${KB}`,
      `himring files folder ${KB} --folder policies/travel --sort updated_at --direction desc --output json`,
    ],
  },
  search_folders: {
    resource: 'files',
    verb: 'folders',
    examples: [`himring files folders ${KB}`, `himring files folders ${KB} --search travel --output json`],
  },
  list_metadata_keys: {
    resource: 'metadata',
    verb: 'keys',
    examples: [`himring metadata keys ${KB}`, `himring metadata keys ${KB} --search reg --output json`],
  },
  list_metadata_values: {
    resource: 'metadata',
    verb: 'values',
    examples: [
      `himring metadata values ${KB} --key region`,
      `himring metadata values ${KB} --key region --search em --output json`,
    ],
  },
  get_file: {
    resource: 'files',
    verb: 'get',
    examples: [`himring files get ${KB} ${FILE}`, `himring files get ${KB} ${FILE} --output json`],
  },
  list_file_versions: {
    resource: 'files',
    verb: 'versions',
    examples: [
      `himring files versions ${KB} ${FILE}`,
      `himring files versions ${KB} ${FILE} --limit 20 --offset 20 --output json`,
    ],
  },
  list_version_blocks: {
    resource: 'files',
    verb: 'blocks',
    examples: [
      `himring files blocks ${KB} ${FILE} --version 2`,
      `himring files blocks ${KB} ${FILE} --version 2 --limit 200 --offset 200 --output json`,
      `himring files blocks ${KB} ${FILE} --version 2 --sheet Rates --from-row 40 --limit 10`,
    ],
  },
  delete_file: {
    resource: 'files',
    verb: 'delete',
    confirm: true,
    examples: [`himring files delete ${KB} ${FILE} --yes`, `himring files delete ${KB} ${FILE} --dry-run`],
  },
  restore_file: {
    resource: 'files',
    verb: 'restore',
    examples: [`himring files restore ${KB} ${FILE}`, `himring files restore ${KB} ${FILE} --output json`],
  },
  get_download_link: {
    resource: 'files',
    verb: 'link',
    examples: [
      `himring files link ${KB} ${FILE} --version 2`,
      `himring files link ${KB} ${FILE} --version 1 --rendition pdf --disposition attachment --output json`,
    ],
  },
  list_questions: {
    resource: 'questions',
    verb: 'list',
    examples: [
      `himring questions list ${KB} --search refund`,
      `himring questions list ${KB} --end-user customer-42 --output json`,
    ],
  },
  erase_end_user: {
    resource: 'end-users',
    verb: 'erase',
    confirm: true,
    examples: [
      'himring end-users erase --end-user customer-42 --yes',
      'himring end-users erase --end-user customer-42 --dry-run',
    ],
  },
} as const satisfies Partial<Record<HimringOperationId, CommandSpec>>
