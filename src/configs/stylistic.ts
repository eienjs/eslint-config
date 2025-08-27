import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from '../types';
import { pluginAntfu } from '../plugins';
import { interopDefault } from '../utils';

export const StylisticConfigDefaults: StylisticConfig = {
  indent: 2,
  quotes: 'single',
};

export interface StylisticOptions extends StylisticConfig, OptionsOverrides { }

export async function stylistic(
  options: StylisticOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    indent,
    overrides = {},
    quotes,
    maxLineLength = 120,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  };

  const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'));

  const config = pluginStylistic.configs.customize({
    indent,
    quotes,
    semi: true,
  }) as TypedFlatConfigItem;

  return [
    {
      name: 'eienjs/stylistic/rules',
      plugins: {
        'antfu': pluginAntfu,
        '@stylistic': pluginStylistic,
      },
      rules: {
        ...config.rules,

        'antfu/consistent-chaining': 'error',
        'antfu/consistent-list-newline': 'error',

        '@stylistic/arrow-parens': ['error', 'always'],
        '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
        '@stylistic/max-len': ['warn', { code: maxLineLength, ignoreComments: true }],
        '@stylistic/padding-line-between-statements': [
          'error',
          {
            blankLine: 'always',
            prev: '*',
            next: ['interface', 'type'],
          },
          // require blank lines before all return statements, like the newline-before-return rule.
          { blankLine: 'always', next: 'return', prev: '*' },
        ],
        '@stylistic/lines-between-class-members': ['error', 'always'],
        '@stylistic/generator-star-spacing': ['error', { after: true, before: false }],
        '@stylistic/quote-props': ['error', 'consistent'],
        '@stylistic/quotes': ['error', quotes, { avoidEscape: true }],
        '@stylistic/semi': 'error',
        '@stylistic/comma-spacing': 'error',
        '@stylistic/yield-star-spacing': ['error', { after: true, before: false }],

        ...overrides,
      },
    },
  ];
}
