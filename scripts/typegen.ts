import fs from 'node:fs/promises';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';
import { builtinRules } from 'eslint/use-at-your-own-risk';
import { combine } from '../src';
import {
  adonisjs,
  astro,
  comments,
  formatters,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  perfectionist,
  regexp,
  sortPackageJson,
  stylistic,
  test,
  toml,
  typescript,
  unicorn,
  vue,
  yaml,
} from '../src/configs';

const configs = await combine(
  {
    plugins: {
      '': {
        rules: Object.fromEntries(builtinRules.entries()),
      },
    },
  },
  adonisjs(),
  astro(),
  comments(),
  formatters(),
  imports(),
  javascript(),
  jsdoc(),
  jsonc(),
  markdown(),
  node(),
  perfectionist(),
  sortPackageJson(),
  stylistic(),
  test(),
  toml(),
  regexp(),
  typescript(),
  unicorn(),
  vue(),
  yaml(),
);

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
