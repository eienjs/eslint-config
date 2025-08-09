import type { TypedFlatConfigItem } from '../types';
import { pluginComments } from '../plugins';

export function comments(): TypedFlatConfigItem[] {
  return [
    {
      name: 'eienjs/eslint-comments/rules',
      plugins: {
        '@eslint-community/eslint-comments': pluginComments as unknown,
      },
      rules: {
        '@eslint-community/eslint-comments/disable-enable-pair': [
          'error',
          {
            allowWholeFile: true,
          },
        ],
        '@eslint-community/eslint-comments/no-aggregating-enable': 'error',
        '@eslint-community/eslint-comments/no-duplicate-disable': 'error',
        '@eslint-community/eslint-comments/no-unlimited-disable': 'error',
        '@eslint-community/eslint-comments/no-unused-enable': 'error',
      },
    },
  ];
}
