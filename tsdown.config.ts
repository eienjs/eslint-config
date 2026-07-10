import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/cli/index.ts', 'src/configs/index.ts'],
    clean: true,
    dts: true,
    shims: true,
    format: ['esm'],
    minify: 'dce-only',
    exports: true,
    unbundle: true,
    deps: {
      onlyBundle: ['find-up-simple'],
    },
  },
]);
