import { eienjs } from './src';

export default eienjs({
  typescript: {
    tsconfigPath: 'tsconfig.json',
    erasableSyntaxOnly: true,
  },
  formatters: true,
  pnpm: true,
}).append({
  files: ['src/**/*.ts'],
  rules: {
    'perfectionist/sort-objects': 'error',
    'unicorn/no-useless-spread': 'off',
  },
});
