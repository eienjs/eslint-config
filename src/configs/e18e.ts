import type { Linter } from 'eslint';
import type { OptionsE18e, TypedFlatConfigItem } from '../types';
import { pluginE18e } from '../plugins';

export function e18e(options: OptionsE18e = {}): TypedFlatConfigItem[] {
  const {
    modernization = true,
    moduleReplacements = false,
    overrides = {},
    performanceImprovements = true,
  } = options;

  const configs = pluginE18e.configs as Record<string, Linter.Config>;

  return [
    {
      name: 'eienjs/e18e/setup',
      plugins: {
        e18e: pluginE18e,
      },
    },
    {
      name: 'eienjs/e18e/rules',
      rules: {
        ...modernization ? { ...configs.modernization.rules } : {},
        ...moduleReplacements ? { ...configs.moduleReplacements.rules } : {},
        ...performanceImprovements ? { ...configs.performanceImprovements.rules } : {},

        // these are a bit opinionated and dangerous (introducing behavioral changes), so we'll disable them by default for now
        'e18e/prefer-array-at': 'off',
        'e18e/prefer-array-from-map': 'off',
        'e18e/prefer-array-to-reversed': 'off',
        'e18e/prefer-array-to-sorted': 'off',
        'e18e/prefer-array-to-spliced': 'off',
        'e18e/prefer-spread-syntax': 'off',

        ...overrides,
      },
    },
  ];
}
