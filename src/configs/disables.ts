import type { TypedFlatConfigItem } from '../types';
import { GLOB_ASTRO, GLOB_JSON, GLOB_JSON5, GLOB_JSONC, GLOB_SRC, GLOB_SRC_EXT, GLOB_TOML, GLOB_YAML } from '../globs';

export function disables(): TypedFlatConfigItem[] {
  return [
    {
      files: [`**/scripts/${GLOB_SRC}`],
      name: 'eienjs/disables/scripts',
      rules: {
        'antfu/no-top-level-await': 'off',
        'no-console': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-deprecated': 'off',
      },
    },
    {
      files: [`**/cli/${GLOB_SRC}`, `**/cli.${GLOB_SRC_EXT}`],
      name: 'eienjs/disables/cli',
      rules: {
        'antfu/no-top-level-await': 'off',
        'no-console': 'off',
        'unicorn/no-process-exit': 'off',
        '@typescript-eslint/no-unnecessary-condition': 'off',
      },
    },
    {
      files: ['**/bin/**/*', `**/bin.${GLOB_SRC_EXT}`],
      name: 'eienjs/disables/bin',
      rules: {
        'antfu/no-import-dist': 'off',
        'antfu/no-import-node-modules-by-path': 'off',
      },
    },
    {
      files: ['**/*.d.?([cm])ts'],
      name: 'eienjs/disables/dts',
      rules: {
        '@eslint-community/eslint-comments/no-unlimited-disable': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      files: ['**/*.js', '**/*.cjs'],
      name: 'eienjs/disables/cjs',
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
    {
      files: [`**/*.config.${GLOB_SRC_EXT}`, `**/*.config.*.${GLOB_SRC_EXT}`],
      name: 'eienjs/disables/config-files',
      rules: {
        'antfu/no-top-level-await': 'off',
        'no-console': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
    {
      files: [GLOB_JSON, GLOB_JSON5, GLOB_JSONC],
      name: 'eienjs/disables/json',
      rules: {
        '@stylistic/max-len': 'off',
      },
    },
    {
      files: [GLOB_YAML],
      name: 'eienjs/disables/yaml',
      rules: {
        '@stylistic/max-len': 'off',
      },
    },
    {
      files: [GLOB_TOML],
      name: 'eienjs/disables/toml',
      rules: {
        '@stylistic/max-len': 'off',
      },
    },
    {
      files: [GLOB_ASTRO],
      name: 'eienjs/disables/astro',
      rules: {
        '@stylistic/max-len': 'off',
      },
    },
  ];
}
