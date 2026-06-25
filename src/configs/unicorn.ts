import type { OptionsUnicorn, TypedFlatConfigItem } from '../types';
import { GLOB_SRC } from '../globs';
import { pluginUnicorn } from '../plugins';

export function unicorn(options: OptionsUnicorn = {}): TypedFlatConfigItem[] {
  const {
    allRecommended = true,
    overrides = {},
  } = options;

  return [
    {
      name: 'eienjs/unicorn/setup',
      plugins: {
        unicorn: pluginUnicorn,
      },
    },
    {
      files: [GLOB_SRC],
      name: 'eienjs/unicorn/rules',
      rules: {
        ...(allRecommended
          ? pluginUnicorn.configs.recommended.rules
          : {
              'unicorn/consistent-empty-array-spread': 'error',
              'unicorn/error-message': 'error',
              'unicorn/escape-case': 'error',
              'unicorn/new-for-builtins': 'error',
              'unicorn/no-instanceof-builtins': 'error',
              'unicorn/no-new-array': 'error',
              'unicorn/no-new-buffer': 'error',
              'unicorn/number-literal-case': 'error',
              'unicorn/prefer-dom-node-text-content': 'error',
              'unicorn/prefer-includes': 'error',
              'unicorn/prefer-node-protocol': 'error',
              'unicorn/prefer-number-properties': 'error',
              'unicorn/prefer-string-starts-ends-with': 'error',
              'unicorn/prefer-type-error': 'error',
              'unicorn/throw-new-error': 'error',
            }),
        'unicorn/consistent-destructuring': 'error',
        'unicorn/consistent-function-scoping': ['error', { checkArrowFunctions: false }],
        // Not expiring to-do comments
        'unicorn/expiring-todo-comments': 'off',
        'unicorn/filename-case': 'off',
        // Disable name-replacements, not use abbreviations in names
        'unicorn/name-replacements': 'off',
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
