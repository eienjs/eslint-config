import type { Linter } from 'eslint';
import type { RuleOptions } from './typegen';
import type { Awaitable, ConfigNames, OptionsConfig, TypedFlatConfigItem } from './types';
import { FlatConfigComposer } from 'eslint-flat-config-utils';
import { findUpSync } from 'find-up-simple';
import { isPackageExists } from 'local-pkg';
import {
  adonisjs,
  astro,
  command,
  comments,
  disables,
  formatters,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  nuxt,
  perfectionist,
  pnpm,
  regexp,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  test,
  toml,
  typescript,
  unicorn,
  vue,
  yaml,
} from './configs';
import { interopDefault, isInEditorEnv } from './utils';

const flatConfigProps = [
  'name',
  'languageOptions',
  'linterOptions',
  'processor',
  'plugins',
  'rules',
  'settings',
] satisfies (keyof TypedFlatConfigItem)[];

const VuePackages = [
  'vue',
  'nuxt',
  'vitepress',
  '@slidev/cli',
];

export const defaultPluginRenaming = {
  'import-lite': 'import',
  'vitest': 'test',
  'yml': 'yaml',
};

// eslint-disable-next-line @typescript-eslint/promise-function-async
export function eienjs(
  options: OptionsConfig & Omit<TypedFlatConfigItem, 'files' | 'ignores'> = {},
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    adonisjs: enableAdonisjs = false,
    astro: enableAstro = false,
    componentExts = [],
    gitignore: enableGitignore = true,
    ignores: userIgnores = [],
    imports: enableImports = true,
    nuxt: enableNuxt = false,
    pnpm: enableCatalogs = Boolean(findUpSync('pnpm-workspace.yaml')),
    regexp: enableRegexp = true,
    typescript: enableTypeScript = isPackageExists('typescript'),
    unicorn: enableUnicorn = true,
    vue: enableVue = VuePackages.some((i) => isPackageExists(i)),
  } = options;

  let { isInEditor } = options;
  if (isInEditor == null) {
    isInEditor = isInEditorEnv();
    if (isInEditor) {
      console.info('[@eienjs/eslint-config] Detected running in editor, some rules are disabled.');
    }
  }

  const stylisticOptions = options.stylistic === false
    ? false
    : (typeof options.stylistic === 'object'
        ? options.stylistic
        : {});

  const configs: Awaitable<TypedFlatConfigItem[]>[] = [];

  if (enableGitignore) {
    if (typeof enableGitignore === 'boolean') {
      configs.push(interopDefault(import('eslint-config-flat-gitignore')).then((r) => [r({
        name: 'eienjs/gitignore',
        strict: false,
      })]));
    } else {
      configs.push(interopDefault(import('eslint-config-flat-gitignore')).then((r) => [r({
        name: 'eienjs/gitignore',
        ...enableGitignore,
      })]));
    }
  }

  const typescriptOptions = resolveSubOptions(options, 'typescript');

  // Base configs
  configs.push(
    ignores(userIgnores),
    javascript({
      isInEditor,
      overrides: getOverrides(options, 'javascript'),
    }),
    comments(),
    node(),
    jsdoc({
      stylistic: stylisticOptions,
    }),
    imports({
      stylistic: stylisticOptions,
    }),
    command(),
    perfectionist(),
  );

  if (enableImports) {
    configs.push(
      imports(enableImports === true
        ? {
            stylistic: stylisticOptions,
          }
        : {
            stylistic: stylisticOptions,
            ...enableImports,
          }),
    );
  }

  if (enableUnicorn) {
    configs.push(unicorn(enableUnicorn === true ? {} : enableUnicorn));
  }

  if (enableVue) {
    componentExts.push('vue');
  }

  if (enableTypeScript) {
    configs.push(typescript({
      ...typescriptOptions,
      componentExts,
      overrides: getOverrides(options, 'typescript'),
      stylistic: stylisticOptions,
    }));
  }

  if (stylisticOptions) {
    configs.push(stylistic({
      ...stylisticOptions,
      overrides: getOverrides(options, 'stylistic'),
    }));
  }

  if (enableRegexp) {
    configs.push(regexp(typeof enableRegexp === 'boolean' ? {} : enableRegexp));
  }

  if (options.test ?? true) {
    configs.push(test({
      isInEditor,
      overrides: getOverrides(options, 'test'),
    }));
  }

  if (enableVue) {
    configs.push(vue({
      ...resolveSubOptions(options, 'vue'),
      overrides: getOverrides(options, 'vue'),
      stylistic: stylisticOptions,
      typescript: Boolean(enableTypeScript),
    }));
  }

  if (enableAstro) {
    configs.push(astro({
      overrides: getOverrides(options, 'astro'),
      stylistic: stylisticOptions,
    }));
  }

  if (enableAdonisjs) {
    configs.push(adonisjs({
      ...resolveSubOptions(options, 'adonisjs'),
      overrides: getOverrides(options, 'adonisjs'),
    }));
  }

  if (enableNuxt) {
    configs.push(nuxt({
      ...resolveSubOptions(options, 'nuxt'),
      overrides: getOverrides(options, 'nuxt'),
      stylistic: stylisticOptions,
    }));
  }

  if (options.jsonc ?? true) {
    configs.push(
      jsonc({
        overrides: getOverrides(options, 'jsonc'),
        stylistic: stylisticOptions,
      }),
      sortPackageJson(),
      sortTsconfig(),
    );
  }

  if (enableCatalogs) {
    configs.push(
      pnpm({
        isInEditor,
      }),
    );
  }

  if (options.yaml ?? true) {
    configs.push(yaml({
      overrides: getOverrides(options, 'yaml'),
      stylistic: stylisticOptions,
    }));
  }

  if (options.toml ?? true) {
    configs.push(toml({
      overrides: getOverrides(options, 'toml'),
      stylistic: stylisticOptions,
    }));
  }

  if (options.markdown ?? true) {
    configs.push(
      markdown(
        {
          componentExts,
          overrides: getOverrides(options, 'markdown'),
        },
      ),
    );
  }

  if (options.formatters) {
    configs.push(formatters(
      options.formatters,
      typeof stylisticOptions === 'boolean' ? {} : stylisticOptions,
    ));
  }

  configs.push(
    disables(),
  );

  if ('files' in options) {
    throw new Error(
      [
        '[@eienjs/eslint-config] ',
        'The first argument should not contain the "files" property as the options are supposed to be global. ',
        'Place it in the second or later config instead.',
      ].join(''),
    );
  }

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = flatConfigProps.reduce<TypedFlatConfigItem>((acc, key) => {
    if (key in options) {
      // @ts-expect-error - ignore, we're just merging
      acc[key] = options[key];
    }

    return acc;
  }, {});
  if (Object.keys(fusedConfig).length > 0) {
    configs.push([fusedConfig]);
  }

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();

  composer = composer
    .append(...configs)
    .renamePlugins(defaultPluginRenaming);

  if (isInEditor) {
    composer = composer
      .disableRulesFix([
        'unused-imports/no-unused-imports',
        'test/no-only-tests',
        'prefer-const',
      ], {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        builtinRules: async () => import(['eslint', 'use-at-your-own-risk'].join('/')).then((r) => r.builtinRules),
      });
  }

  return composer;
};

export type ResolvedOptions<T> = T extends boolean
  ? never
  : NonNullable<T>;

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return (typeof options[key] === 'boolean'
    ? {}
    : options[key] || {}) as ResolvedOptions<OptionsConfig[K]>;
}

export function getOverrides(
  options: OptionsConfig,
  key: keyof OptionsConfig,
): Partial<Linter.RulesRecord & RuleOptions> {
  const sub = resolveSubOptions(options, key);

  return {
    ...'overrides' in sub
      ? sub.overrides
      : {},
  };
}
