import type { OptionsOverrides, TypedFlatConfigItem } from '../types';
import { pluginUnicorn } from '../plugins';

export async function unicorn(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options;

  return [
    {
      name: 'eienjs/unicorn/rules',
      plugins: {
        unicorn: pluginUnicorn,
      },
      rules: {
        ...pluginUnicorn.configs.recommended.rules,

        'unicorn/no-this-assignment': 'off',
        'unicorn/consistent-destructuring': 'error',
        'unicorn/consistent-function-scoping': ['error', { checkArrowFunctions: false }],
        'unicorn/filename-case': [
          'error',
          {
            case: 'snakeCase',
          },
        ],
        'unicorn/no-null': 'off',
        // Enable usage for helpers classes
        'unicorn/no-static-only-class': 'off',
        // Dificult read a number
        'unicorn/numeric-separators-style': 'off',
        // Disable dom-node-because-usage with nodejs not its completed
        'unicorn/prefer-dom-node-append': 'off',
        'unicorn/prefer-dom-node-dataset': 'off',
        'unicorn/prefer-dom-node-remove': 'off',
        'unicorn/prefer-dom-node-text-content': 'off',
        'unicorn/prefer-modern-dom-apis': 'off',
        // Disable because ssr not completed query selector
        'unicorn/prefer-query-selector': 'off',
        'unicorn/prefer-switch': ['error', { emptyDefaultCase: 'do-nothing-comment' }],
        // Disable prevent-abbrevations, its necessary in frameworks
        'unicorn/prevent-abbreviations': 'off',
        // Disable because not work with others function like then
        'unicorn/no-thenable': 'off',
        // Not expiring to-do comments
        'unicorn/expiring-todo-comments': 'off',
        // Disable because match other functions with object is not array
        'unicorn/no-array-reduce': 'off',
        'unicorn/prefer-export-from': 'off',

        ...overrides,
      },
    },
  ];
}
