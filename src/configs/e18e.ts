import type { Linter } from 'eslint';
import type { OptionsE18e, OptionsIsInEditor, TypedFlatConfigItem } from '../types';
import { pluginE18e } from '../plugins';

export function e18e(options: OptionsIsInEditor & OptionsE18e = {}): TypedFlatConfigItem[] {
  const {
    isInEditor = false,
    modernization = true,
    moduleReplacements = isInEditor,
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
        ...overrides,
      },
    },
  ];
}
