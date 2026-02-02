import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/cli/index.ts', 'src/configs/index.ts'],
    shims: true,
    format: ['esm'],
    target: 'esnext',
    platform: 'node',
    exports: true,
    unbundle: true,
    inlineOnly: ['find-up-simple'],
  },
]);
