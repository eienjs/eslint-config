import type { OptionsOverrides, TypedFlatConfigItem } from '../types';
import { GLOB_SRC } from '../globs';
import { pluginUnicorn } from '../plugins';

export function unicorn(options: OptionsOverrides = {}): TypedFlatConfigItem[] {
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
        'unicorn/consistent-destructuring': 'error',
        'unicorn/consistent-function-scoping': ['error', { checkArrowFunctions: false }],
        // Not expiring to-do comments
        'unicorn/expiring-todo-comments': 'off',
        'unicorn/filename-case': 'off',
        // Disable because match other functions with object is not array
        'unicorn/no-array-reduce': 'off',
        'unicorn/no-null': 'off',
        // Enable usage for helpers classes
        'unicorn/no-static-only-class': 'off',
        // Disable because not work with others function like then
        'unicorn/no-thenable': 'off',
        'unicorn/no-this-assignment': 'off',
        // Dificult read a number
        'unicorn/numeric-separators-style': 'off',
        // Disable dom-node-because-usage with nodejs not its completed
        'unicorn/prefer-dom-node-append': 'off',
        'unicorn/prefer-dom-node-dataset': 'off',
        'unicorn/prefer-dom-node-remove': 'off',
        'unicorn/prefer-dom-node-text-content': 'off',
        // Preferences
        'unicorn/prefer-export-from': 'off',
        'unicorn/prefer-modern-dom-apis': 'off',
        // Disable because ssr not completed query selector
        'unicorn/prefer-query-selector': 'off',
        'unicorn/prefer-switch': ['error', { emptyDefaultCase: 'do-nothing-comment' }],
        'unicorn/prefer-top-level-await': 'off',
        // Disable prevent-abbrevations, its necessary in frameworks
        'unicorn/prevent-abbreviations': 'off',
        ...overrides,
      },
    },
    {
      files: [GLOB_SRC],
      name: 'eienjs/unicorn/special-rules',
      rules: {
        'unicorn/filename-case': [
          'error',
          {
            case: 'snakeCase',
          },
        ],
      },
    },
  ];
}
