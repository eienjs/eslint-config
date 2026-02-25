import type { TypedFlatConfigItem } from '../types';
import { GLOB_SRC } from '../globs';
import { pluginNode } from '../plugins';

export function node(): TypedFlatConfigItem[] {
  return [
    {
      name: 'eienjs/node/setup',
      plugins: {
        n: pluginNode,
      },
    },
    {
      files: [GLOB_SRC],
      name: 'eienjs/node/rules',
      rules: {
        'n/handle-callback-err': ['error', '^(err|error)$'],
        'n/no-deprecated-api': 'error',
        'n/no-exports-assign': 'error',
        'n/no-new-require': 'error',
        'n/no-path-concat': 'error',
        'n/prefer-global/buffer': ['error', 'never'],
        'n/prefer-global/process': ['error', 'never'],
        'n/process-exit-as-throw': 'error',
      },
    },
  ];
}
