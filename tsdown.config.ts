import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/configs/index.ts'],
    shims: true,
    format: ['esm'],
  },
]);
