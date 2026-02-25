import type { OptionsComponentExts, OptionsFiles, OptionsMarkdown, TypedFlatConfigItem } from '../types';
import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors';
import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN } from '../globs';
import { interopDefault } from '../utils';

export async function markdown(
  options: OptionsFiles & OptionsComponentExts & OptionsMarkdown = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    componentExts = [],
    files = [GLOB_MARKDOWN],
    gfm = true,
    overrides = {},
    overridesMarkdown = {},
  } = options;

  const markdown = await interopDefault(import('@eslint/markdown'));

  return [
    {
      name: 'eienjs/markdown/setup',
      plugins: {
        markdown,
      },
    },
    {
      files,
      ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
      name: 'eienjs/markdown/processor',
      // `eslint-plugin-markdown` only creates virtual files for code blocks,
      // but not the markdown file itself. We use `eslint-merge-processors` to
      // add a pass-through processor for the markdown file itself.
      processor: mergeProcessors([
        markdown.processors.markdown,
        processorPassThrough,
      ]),
    },
    {
      files,
      language: gfm ? 'markdown/gfm': 'markdown/commonmark',
      name: 'eienjs/markdown/parser',
    },
    {
      files,
      name: 'eienjs/markdown/rules',
      rules: {
        ...markdown.configs.recommended.at(0)?.rules,
        'markdown/no-missing-label-refs': 'off',
        ...overridesMarkdown,
      },
    },
    {
      files,
      name: 'eienjs/markdown/disables/markdown',
      rules: {
        // Disable rules do not work with markdown sourcecode.
        'command/command': 'off',
        'no-irregular-whitespace': 'off',
        'perfectionist/sort-exports': 'off',
        'perfectionist/sort-imports': 'off',
        'regexp/no-legacy-features': 'off',
        'regexp/no-missing-g-flag': 'off',
        'regexp/no-useless-dollar-replacements': 'off',
        'regexp/no-useless-flag': 'off',
        '@stylistic/indent': 'off',
      },
    },
    {
      files: [
        GLOB_MARKDOWN,
        GLOB_MARKDOWN_CODE,
        ...componentExts.map((ext) => `${GLOB_MARKDOWN}/**/*.${ext}`),
      ],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            impliedStrict: true,
          },
        },
      },
      name: 'eienjs/markdown/disables/code',
      rules: {
        '@stylistic/comma-dangle': 'off',
        '@stylistic/eol-last': 'off',
        '@stylistic/max-len': 'off',
        '@stylistic/padding-line-between-statements': 'off',
        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-redeclare': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        'antfu/no-top-level-await': 'off',
        'n/prefer-global/process': 'off',
        'no-alert': 'off',
        'no-console': 'off',
        'no-labels': 'off',
        'no-lone-blocks': 'off',
        'no-restricted-syntax': 'off',
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'no-unused-labels': 'off',
        'no-unused-vars': 'off',
        'unicode-bom': 'off',
        'unused-imports/no-unused-imports': 'off',
        'unused-imports/no-unused-vars': 'off',
        ...overrides,
      },
    },
  ];
}
