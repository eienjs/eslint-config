import type { Linter } from 'eslint';
import type {
  OptionsFiles,
  OptionsHasTypeScript,
  OptionsOverrides,
  OptionsStylistic,
  OptionsVue,
  TypedFlatConfigItem,
} from '../types';
import { mergeProcessors } from 'eslint-merge-processors';
import { GLOB_VUE } from '../globs';
import { interopDefault } from '../utils';

export async function vue(
  options: OptionsVue & OptionsHasTypeScript & OptionsOverrides & OptionsStylistic & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_VUE],
    overrides = {},
    stylistic = true,
    typescript,
  } = options;

  const sfcBlocks = options.sfcBlocks === true
    ? {}
    : options.sfcBlocks ?? {};

  const {
    indent = 2,
  } = typeof stylistic === 'boolean' ? {} : stylistic;

  const [
    pluginVue,
    parserVue,
    processorVueBlocks,
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-vue')),
    interopDefault(import('vue-eslint-parser')),
    interopDefault(import('eslint-processor-vue-blocks')),
  ] as const);

  return [
    {
      // This allows Vue plugin to work with auto imports
      // https://github.com/vuejs/eslint-plugin-vue/pull/2422
      languageOptions: {
        globals: {
          computed: 'readonly',
          defineEmits: 'readonly',
          defineExpose: 'readonly',
          defineProps: 'readonly',
          onMounted: 'readonly',
          onUnmounted: 'readonly',
          reactive: 'readonly',
          ref: 'readonly',
          shallowReactive: 'readonly',
          shallowRef: 'readonly',
          toRef: 'readonly',
          toRefs: 'readonly',
          watch: 'readonly',
          watchEffect: 'readonly',
        },
      },
      name: 'eienjs/vue/setup',
      plugins: {
        vue: pluginVue,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          extraFileExtensions: ['.vue'],
          parser: typescript
            ? await interopDefault(import('@typescript-eslint/parser'))
            : null,
          sourceType: 'module',
        },
      },
      name: 'eienjs/vue/rules',
      processor: sfcBlocks === false
        ? pluginVue.processors['.vue'] as Linter.Processor | undefined
        : mergeProcessors([
            pluginVue.processors['.vue'] as Linter.Processor,
            processorVueBlocks({
              ...sfcBlocks,
              blocks: {
                styles: true,
                ...sfcBlocks.blocks,
              },
            }),
          ]),
      rules: {
        ...pluginVue.configs.base.rules,
        ...pluginVue.configs['flat/essential'].map((c) => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}),
        ...pluginVue.configs['flat/strongly-recommended'].map((c) => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}),
        ...pluginVue.configs['flat/recommended'].map((c) => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}),

        'vue/block-lang': [
          'error',
          {
            script: {
              lang: 'ts',
            },
          },
        ],
        'vue/block-order': ['error', {
          order: ['script', 'template', 'style'],
        }],
        'vue/component-api-style': ['error', ['script-setup']],
        'vue/component-name-in-template-casing': ['error', 'PascalCase', { registeredComponentsOnly: true }],
        'vue/component-options-name-casing': ['error', 'PascalCase'],
        'vue/custom-event-name-casing': ['error', 'camelCase'],
        'vue/define-macros-order': ['error', {
          order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
        }],
        'vue/define-props-declaration': ['error', 'runtime'],
        'vue/dot-location': ['error', 'property'],
        'vue/dot-notation': ['error', { allowKeywords: true }],
        'vue/eqeqeq': ['error', 'smart'],
        'vue/html-indent': ['error', indent],
        'vue/html-quotes': ['error', 'double'],
        'vue/max-attributes-per-line': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/no-dupe-keys': 'off',
        'vue/no-empty-component-block': 'error',
        'vue/no-empty-pattern': 'error',
        'vue/no-irregular-whitespace': 'error',
        'vue/no-loss-of-precision': 'error',
        'vue/no-multiple-objects-in-class': 'error',
        'vue/no-ref-object-reactivity-loss': 'error',
        'vue/no-required-prop-with-default': 'error',
        'vue/no-restricted-syntax': [
          'error',
          'DebuggerStatement',
          'LabeledStatement',
          'WithStatement',
        ],
        'vue/no-restricted-v-bind': ['error', '/^v-/'],
        'vue/no-root-v-if': 'error',
        'vue/no-setup-props-reactivity-loss': 'off',
        'vue/no-sparse-arrays': 'error',
        'vue/no-template-target-blank': 'error',
        'vue/no-unused-properties': 'error',
        'vue/no-unused-refs': 'error',
        'vue/no-use-v-else-with-v-for': 'error',
        'vue/no-useless-mustaches': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/no-v-html': 'off',
        'vue/object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        'vue/prefer-separate-static-class': 'error',
        'vue/prefer-template': 'error',
        'vue/prefer-true-attribute-shorthand': 'error',
        'vue/prop-name-casing': ['error', 'camelCase'],
        'vue/require-typed-ref': 'error',
        'vue/space-infix-ops': 'error',
        'vue/space-unary-ops': ['error', { nonwords: false, words: true }],
        'vue/static-class-names-order': 'off',

        ...stylistic
          ? {
              'vue/array-bracket-spacing': ['error', 'never'],
              'vue/arrow-spacing': ['error', { after: true, before: true }],
              'vue/block-spacing': ['error', 'always'],
              'vue/block-tag-newline': ['error', {
                multiline: 'always',
                singleline: 'always',
              }],
              'vue/brace-style': ['error', '1tbs', { allowSingleLine: true }],
              'vue/comma-dangle': ['error', 'always-multiline'],
              'vue/comma-spacing': ['error', { after: true, before: false }],
              'vue/comma-style': ['error', 'last'],
              'vue/html-comment-content-spacing': ['error', 'always', {
                exceptions: ['-'],
              }],
              'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
              'vue/keyword-spacing': ['error', { after: true, before: true }],
              'vue/object-curly-newline': 'off',
              'vue/object-curly-spacing': ['error', 'always'],
              'vue/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
              'vue/operator-linebreak': ['error', 'before'],
              'vue/padding-line-between-blocks': ['error', 'always'],
              'vue/quote-props': ['error', 'consistent-as-needed'],
              'vue/space-in-parens': ['error', 'never'],
              'vue/template-curly-spacing': 'error',
            }
          : {},

        // Disable usage in vue files
        'unicorn/filename-case': 'off',
        'antfu/no-top-level-await': 'off',
        'n/prefer-global/process': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@stylistic/max-len': 'off',

        ...overrides,
      },
    },
  ];
}
