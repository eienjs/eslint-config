import fs from 'node:fs/promises';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';
import { builtinRules } from 'eslint/use-at-your-own-risk';
import eienjs from '../src';

const configs = await eienjs({
  adonisjs: true,
  astro: true,
  formatters: true,
  imports: true,
  jsonc: true,
  markdown: true,
  nuxt: true,
  pnpm: true,
  regexp: true,
  stylistic: true,
  gitignore: true,
  typescript: {
    tsconfigPath: 'tsconfig.json',
    erasableSyntaxOnly: true,
  },
  unicorn: true,
  vue: true,
  yaml: true,
  toml: true,
  test: true,
}).prepend({
  plugins: {
    '': {
      rules: Object.fromEntries(builtinRules.entries()),
    },
  },
});

const configNames = configs.map((item) => item.name).filter(Boolean) as string[];

// @ts-expect-error - ignore, we're just generating the types
let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.length === 0 ? '' : configNames.map((i) => `'${i}'`).join(' | ')}
`;

await fs.writeFile('src/typegen.d.ts', dts);
