import type { OptionsFiles, OptionsIsInEditor, OptionsOverrides, TypedFlatConfigItem } from '../types';
import { GLOB_TESTS } from '../globs';
import { interopDefault } from '../utils';

// Hold the reference so we don't redeclare the plugin on each call
let _pluginTest: unknown;

export async function test(
  options: OptionsFiles & OptionsIsInEditor & OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = GLOB_TESTS,
    isInEditor = false,
    overrides = {},
  } = options;

  const [
    pluginVitest,
    pluginNoOnlyTests,
  ] = await Promise.all([
    interopDefault(import('@vitest/eslint-plugin')),
    // @ts-expect-error missing types
    interopDefault<{ rules: Record<string, unknown> }>(import('eslint-plugin-no-only-tests')),
  ] as const);

  _pluginTest = _pluginTest || {
    ...pluginVitest,
    rules: {
      ...pluginVitest.rules,
      // extend `test/no-only-tests` rule
      ...pluginNoOnlyTests.rules,
    },
  };

  return [
    {
      name: 'eienjs/test/setup',
      plugins: {
        test: _pluginTest,
      },
    },
    {
      files,
      name: 'eienjs/test/rules',
      rules: {
        'test/consistent-test-it': ['error', { fn: 'test', withinDescribe: 'test' }],
        'test/no-identical-title': 'error',
        'test/no-import-node-test': 'error',
        'test/no-only-tests': isInEditor ? 'warn' : 'error',

        'test/prefer-hooks-in-order': 'error',
        'test/prefer-lowercase-title': 'error',

        // Disables

        'antfu/no-top-level-await': 'off',
        'no-unused-expressions': 'off',
        'n/prefer-global/process': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',

        ...overrides,
      },
    },
  ];
}
