import { eienjs } from './src';

export default eienjs({
  typescript: {
    tsconfigPath: 'tsconfig.json',
    erasableSyntaxOnly: true,
  },
  formatters: true,
  pnpm: true,
  perfectionist: true,
  markdown: {
    overrides: {
      'no-dupe-keys': 'off',
    },
  },
}).append({
  files: ['src/**/*.ts'],
  rules: {
    'perfectionist/sort-objects': 'error',
  },
});
