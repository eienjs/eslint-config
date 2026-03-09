import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/cli/index.ts', 'src/configs/index.ts'],
    clean: true,
    format: 'esm',
    minify: 'dce-only',
    fixedExtension: false,
    dts: true,
    sourcemap: false,
    target: 'esnext',
    exports: true,
    unbundle: true,
    deps: {
      onlyAllowBundle: ['find-up-simple'],
    },
  },
]);
