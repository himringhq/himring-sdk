import type { HimringOperationId } from '@himring/sdk'

export const DATABASE_WORKSPACE_RESOURCE_DESCRIPTIONS: Readonly<Record<string, string>> = {
  tables:
    'List the tables and views of a database, with their columns, keys, and indexes, and create a table through a migration that Himring writes.',
  rows: 'Read, add, change, and delete the rows of a table.',
  sql: 'Run SQL against a database, and confirm the statements that change rows when the database has the write preview on.',
  'saved-queries': 'Save, list, and delete the queries that the members of a project keep for a database.',
  'change-proposals': 'Turn a plain request into a migration for review.',
  columns:
    'Add, rename, retype, and drop the columns of a table, and change NOT NULL and defaults, through a migration that Himring writes.',
  imports:
    'Upload a CSV or XLSX file, check every row against a table, and insert the passing rows in one transaction.',
}

const DB = '--database db_3a9e5c7b1d2f4e6a8c0b9d7f5e3a1c2b'
const TABLE = '--table-name orders'
const IMPORT = '--import 9f2c4e6a8b0d1f3e5a7c9b1d3f5e7a9c'

export const DATABASE_WORKSPACE_EXAMPLES = {
  list_database_tables: [`himring tables list ${DB}`, `himring tables list ${DB} --output json`],
  list_table_rows: [
    `himring rows list ${DB} ${TABLE}`,
    `himring rows list ${DB} ${TABLE} --filters-file filters.json --sorts-file sorts.json --page-size 50 --output json`,
  ],
  get_table_row: [`echo '[42]' | himring rows get ${DB} ${TABLE} --key-file -`],
  insert_table_row: [`echo '{"customer_id":1042,"total":120}' | himring rows add ${DB} ${TABLE} --values-file -`],
  update_table_row: [`himring rows update ${DB} ${TABLE} --input-file change.json --yes`],
  delete_table_rows: [`echo '[[42],[43]]' | himring rows delete ${DB} ${TABLE} --keys-file - --yes`],
  run_database_sql: [
    `himring sql run ${DB} --sql "SELECT status, count(*) FROM orders GROUP BY status"`,
    `himring sql run ${DB} --sql "UPDATE orders SET status = 'shipped' WHERE id = 42"`,
    `himring sql run ${DB} --sql-file archive.sql --confirmation-token "$TOKEN" --output json`,
  ],
  list_saved_queries: [`himring saved-queries list ${DB}`, `himring saved-queries list ${DB} --output json`],
  save_query: [`himring saved-queries save ${DB} --name "Open orders" --sql-file open-orders.sql`],
  delete_saved_query: [`himring saved-queries delete ${DB} --saved-query sql_5c1e9a3b7d2f4e6a8c0b9d7f5e3a1c2b --yes`],
  propose_database_change: [
    `himring change-proposals create ${DB} --request "Add a delivered_at column to orders"`,
    `himring change-proposals create ${DB} --request "Split customers.name into first and last names" --output json`,
  ],
  preview_table_column_changes: [
    `echo '[{"kind":"alter","column":"total","type":"real"}]' | himring columns preview ${DB} ${TABLE} --changes-file -`,
    `himring columns preview ${DB} ${TABLE} --changes-file changes.json --output json`,
  ],
  change_table_columns: [
    `echo '[{"kind":"add","name":"delivered_at","type":"datetime"}]' | himring columns change ${DB} ${TABLE} --changes-file - --expected-migration-version 4 --yes`,
  ],
  preview_create_table: [
    `echo '[{"name":"id","type":"integer","primary_key":true},{"name":"email","type":"text","not_null":true,"unique":true}]' | himring tables preview ${DB} --table-name customers --columns-file -`,
  ],
  create_table: [
    `himring tables create ${DB} --table-name customers --columns-file columns.json --expected-migration-version 3`,
    `himring tables create ${DB} --table-name customers --columns-file columns.json --expected-migration-version 3 --output json`,
  ],
  export_table_rows: [
    `himring rows export ${DB} ${TABLE} --format csv --out orders.csv`,
    `echo '[{"column":"status","operator":"eq","value":"open"}]' | himring rows export ${DB} ${TABLE} --format sql --filters-file -`,
  ],
  check_table_import: [
    `echo '[{"source_index":0,"column_name":"id"},{"source_index":1,"column_name":"status"}]' | himring imports check ${DB} ${IMPORT} ${TABLE} --columns-file -`,
  ],
  apply_table_import: [
    `himring imports apply ${DB} ${IMPORT} ${TABLE} --columns-file columns.json --expected-failed 0 --expected-migration-version 4`,
  ],
  discard_table_import: [`himring imports discard ${DB} ${IMPORT}`],
} as const satisfies Partial<Record<HimringOperationId, readonly string[]>>
