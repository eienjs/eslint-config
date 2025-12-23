import fs from 'node:fs/promises';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';
import { builtinRules } from 'eslint/use-at-your-own-risk';
import { CONFIG_PRESET_FULL_ON } from '../src/config_presets';
import { eienjs } from '../src/factory';

const configs = await eienjs(CONFIG_PRESET_FULL_ON)
  .prepend({
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
