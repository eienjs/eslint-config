import type { TypedFlatConfigItem } from '../types';
import { GLOB_MARKDOWN, GLOB_SRC, GLOB_SRC_EXT } from '../globs';

export async function disables(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: [`**/scripts/${GLOB_SRC}`],
      name: 'eienjs/disables/scripts',
      rules: {
        'antfu/no-top-level-await': 'off',
        'no-console': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
    // {
    //   files: [`**/cli/${GLOB_SRC}`, `**/cli.${GLOB_SRC_EXT}`],
    //   name: 'antfu/disables/cli',
    //   rules: {
    //     'antfu/no-top-level-await': 'off',
    //     'no-console': 'off',
    //   },
    // },
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
      files: [GLOB_MARKDOWN],
      name: 'eienjs/disables/markdown',
      rules: {
        'unicorn/filename-case': 'off',
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
  ];
}
