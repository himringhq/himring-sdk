import { defineConfig } from 'tsup'

export default defineConfig({
  entry: { main: 'src/main.ts' },
  format: 'esm',
  platform: 'node',
  target: 'node22',
  outDir: 'dist',
  clean: true,
  splitting: false,
  sourcemap: false,
  dts: false,
  removeNodeProtocol: false,
})
