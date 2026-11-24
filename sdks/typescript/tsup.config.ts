import { writeFile } from 'node:fs/promises'
import { defineConfig, type Options } from 'tsup'

const COMMONJS_DIRECTORY = 'dist/cjs'
const COMMONJS_PACKAGE_MARKER = `${JSON.stringify({ type: 'commonjs' })}\n`

const sharedOptions: Options = {
  entry: {
    index: 'src/index.ts',
    catalogue: 'src/catalogue.ts',
    'answers/index': 'src/answers/index.ts',
    'folders/index': 'src/folders/index.ts',
  },
  platform: 'node',
  target: 'node22',
  splitting: true,
  treeshake: true,
  sourcemap: false,
  dts: false,
  removeNodeProtocol: false,
}

async function markCommonJsDirectory(): Promise<void> {
  await writeFile(`${COMMONJS_DIRECTORY}/package.json`, COMMONJS_PACKAGE_MARKER)
}

export default defineConfig([
  {
    ...sharedOptions,
    format: 'esm',
    outDir: 'dist',
    clean: ['**/*', '!cjs/**'],
  },
  {
    ...sharedOptions,
    format: 'cjs',
    outDir: COMMONJS_DIRECTORY,
    clean: true,
    onSuccess: markCommonJsDirectory,
  },
])
