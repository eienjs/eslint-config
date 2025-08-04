import type { OptionsNuxt, OptionsStylistic, TypedFlatConfigItem } from '../types';
import { join } from 'pathe';
import { GLOB_EXTS, GLOB_SRC, GLOB_VUE } from '../globs';
import { ensurePackages, interopDefault } from '../utils';

export async function nuxt(
  options: OptionsNuxt & OptionsStylistic = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    dirs = {},
    version = 4,
    stylistic = true,
  } = options;

  const {
    sortConfigKeys = Boolean(stylistic),
  } = options;

  await ensurePackages([
    '@nuxt/eslint-plugin',
  ]);

  const pluginNuxt = await interopDefault(import('@nuxt/eslint-plugin'));

  dirs.root = dirs.root ?? [version === 4 ? './app' : '.'];
  dirs.src = dirs.src ?? dirs.root;
  dirs.pages = dirs.pages ?? dirs.src.map((src) => `${src}/pages`);
  dirs.layouts = dirs.layouts ?? dirs.src.map((src) => `${src}/layouts`);
  dirs.components = dirs.components ?? dirs.src.map((src) => `${src}/components`);
  dirs.composables = dirs.composables ?? dirs.src.map((src) => `${src}/composables`);
  dirs.plugins = dirs.plugins ?? dirs.src.map((src) => `${src}/plugins`);
  dirs.modules = dirs.modules ?? dirs.src.map((src) => `${src}/modules`);
  dirs.middleware = dirs.middleware ?? dirs.src.map((src) => `${src}/middleware`);
  dirs.servers = dirs.servers ?? dirs.src.map((src) => `${src}/servers`);
  dirs.utils = dirs.utils ?? dirs.src.map((src) => `${src}/utils`);
  dirs.componentsPrefixed = dirs.componentsPrefixed ?? [];

  const fileSingleRoot = [
    ...(dirs.layouts?.map((layoutsDir) => join(layoutsDir, `**/*.${GLOB_EXTS}`)) || []),
    ...(dirs.pages?.map((pagesDir) => join(pagesDir, `**/*.${GLOB_EXTS}`)) || []),
    ...(dirs.components?.map((componentsDir) => join(componentsDir, `**/*.server.${GLOB_EXTS}`)) || []),
  ].sort();

  // imported from 'eslint-plugin-vue/lib/utils/inline-non-void-elements.json'
  const INLINE_ELEMENTS = [
    'a',
    'abbr',
    'audio',
    'b',
    'bdi',
    'bdo',
    'canvas',
    'cite',
    'code',
    'data',
    'del',
    'dfn',
    'em',
    'i',
    'iframe',
    'ins',
    'kbd',
    'label',
    'map',
    'mark',
    'noscript',
    'object',
    'output',
    'picture',
    'q',
    'ruby',
    's',
    'samp',
    'small',
    'span',
    'strong',
    'sub',
    'sup',
    'svg',
    'time',
    'u',
    'var',
    'video',
  ];

  return [
    {
      name: 'eienjs/nuxt/setup',
      plugins: {
        nuxt: pluginNuxt,
      },
      languageOptions: {
        globals: {
          $fetch: 'readonly',
        },
      },
    },
    ...fileSingleRoot.length > 0
      ? [
          {
            files: fileSingleRoot,
            name: 'eienjs/nuxt/vue/single-root',
            rules: {
              'vue/no-multiple-template-root': 'error',
            },
          } as TypedFlatConfigItem,
        ]
      : [],
    {
      name: 'eienjs/nuxt/rules',
      rules: {
        'nuxt/prefer-import-meta': 'error',
        ...overrides,
      },
    },
    {
      files: dirs.utils.map((utilsDir) => join(utilsDir, GLOB_SRC)),
      name: 'eienjs/nuxt/utils-disables',
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
    ...sortConfigKeys
      ? [
          {
            files: ['**/nuxt.config.?([cm])[jt]s?(x)'],
            name: 'eienjs/nuxt/sort-config',
            rules: {
              'nuxt/nuxt-config-keys-order': 'error',
            },
          } as TypedFlatConfigItem,
        ]
      : [],
    ...stylistic
      ? [
          {
            files: [GLOB_VUE],
            name: 'eienjs/nuxt/vue/rules',
            rules: {
              'vue/multiline-html-element-content-newline': [
                'error',
                {
                  ignoreWhenEmpty: true,
                  ignores: [
                    'pre',
                    'textarea',
                    'router-link',
                    'RouterLink',
                    'nuxt-link',
                    'NuxtLink',
                    'u-link',
                    'ULink',
                    ...INLINE_ELEMENTS,
                  ],
                  allowEmptyLines: false,
                },
              ],
              'vue/singleline-html-element-content-newline': [
                'error',
                {
                  ignoreWhenNoAttributes: true,
                  ignoreWhenEmpty: true,
                  ignores: [
                    'pre',
                    'textarea',
                    'router-link',
                    'RouterLink',
                    'nuxt-link',
                    'NuxtLink',
                    'u-link',
                    'ULink',
                    ...INLINE_ELEMENTS,
                  ],
                  externalIgnores: [],
                },
              ],
            },
          } as TypedFlatConfigItem,
        ]
      : [],
  ];
};
