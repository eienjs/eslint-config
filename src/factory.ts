import { FlatConfigComposer } from 'eslint-flat-config-utils';
import { Awaitable, ConfigNames, OptionsConfig, TypedFlatConfigItem } from "./types";
import { isPackageExists } from 'local-pkg';
import { interopDefault, isInEditorEnv } from './utils';
import { Linter } from 'eslint';
import { RuleOptions } from '@stylistic/eslint-plugin';
import { ignores } from './configs/ignores';
import { disables } from './configs/disables';
import { astro } from './configs/astro';
import { javascript } from './configs/javascript';

const flatConfigProps = [
  'name',
  'languageOptions',
  'linterOptions',
  'processor',
  'plugins',
  'rules',
  'settings',
] satisfies (keyof TypedFlatConfigItem)[]

const VuePackages = [
  'vue',
  'nuxt',
  'vitepress',
  '@slidev/cli',
]

export function eienjs(options: OptionsConfig & Omit<TypedFlatConfigItem, 'files'> = {}): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
const {
    astro: enableAstro = false,
    componentExts = [],
    gitignore: enableGitignore = true,
    imports: enableImports = true,
    pnpm: enableCatalogs = false,
    typescript: enableTypeScript = isPackageExists('typescript'),
    vue: enableVue = VuePackages.some(i => isPackageExists(i)),
  } = options

  let isInEditor = options.isInEditor
  if (isInEditor == null) {
    isInEditor = isInEditorEnv()
    if (isInEditor)
      console.info('[@eienjs/eslint-config] Detected running in editor, some rules are disabled.')
  }

  const stylisticOptions = options.stylistic === false
    ? false
    : typeof options.stylistic === 'object'
      ? options.stylistic
      : {}

  const configs: Awaitable<TypedFlatConfigItem[]>[] = []

  if (enableGitignore) {
    if (typeof enableGitignore !== 'boolean') {
      configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r({
        name: 'eienjs/gitignore',
        ...enableGitignore,
      })]))
    }
    else {
      configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r({
        name: 'eienjs/gitignore',
        strict: false,
      })]))
    }
  }

  const typescriptOptions = resolveSubOptions(options, 'typescript')
  const tsconfigPath = 'tsconfigPath' in typescriptOptions ? typescriptOptions.tsconfigPath : undefined

  // Base configs
  configs.push(
    ignores(options.ignores),
    javascript({
      isInEditor,
      overrides: getOverrides(options, 'javascript'),
    }),
    // comments(),
    // node(),
    // jsdoc({
    //   stylistic: stylisticOptions,
    // }),
    // imports({
    //   stylistic: stylisticOptions,
    // }),
    // command(),
    // unicorn()

    // // Optional plugins (installed but not enabled by default)
    // perfectionist(),
  )

  // if (enableImports) {
  //   configs.push(
  //     imports(enableImports === true
  //       ? {
  //           stylistic: stylisticOptions,
  //         }
  //       : {
  //           stylistic: stylisticOptions,
  //           ...enableImports,
  //         }),
  //   )
  // }

  // if (enableVue) {
  //   componentExts.push('vue')
  // }

  // if (enableTypeScript) {
  //   configs.push(typescript({
  //     ...typescriptOptions,
  //     componentExts,
  //     overrides: getOverrides(options, 'typescript'),
  //   }))
  // }

  // if (stylisticOptions) {
  //   configs.push(stylistic({
  //     ...stylisticOptions,
  //     overrides: getOverrides(options, 'stylistic'),
  //   }))
  // }

  // if (options.test ?? true) {
  //   configs.push(test({
  //     isInEditor,
  //     overrides: getOverrides(options, 'test'),
  //   }))
  // }

  // if (enableVue) {
  //   configs.push(vue({
  //     ...resolveSubOptions(options, 'vue'),
  //     overrides: getOverrides(options, 'vue'),
  //     stylistic: stylisticOptions,
  //     typescript: !!enableTypeScript,
  //   }))
  // }

  if (enableAstro) {
    configs.push(astro({
      overrides: getOverrides(options, 'astro'),
      stylistic: stylisticOptions,
    }))
  }

  // if (options.jsonc ?? true) {
  //   configs.push(
  //     jsonc({
  //       overrides: getOverrides(options, 'jsonc'),
  //       stylistic: stylisticOptions,
  //     }),
  //     sortPackageJson(),
  //     sortTsconfig(),
  //   )
  // }

  // if (enableCatalogs) {
  //   configs.push(
  //     pnpm(),
  //   )
  // }

  // if (options.yaml ?? true) {
  //   configs.push(yaml({
  //     overrides: getOverrides(options, 'yaml'),
  //     stylistic: stylisticOptions,
  //   }))
  // }

  // if (options.toml ?? true) {
  //   configs.push(toml({
  //     overrides: getOverrides(options, 'toml'),
  //     stylistic: stylisticOptions,
  //   }))
  // }

  // if (options.markdown ?? true) {
  //   configs.push(
  //     markdown(
  //       {
  //         componentExts,
  //         overrides: getOverrides(options, 'markdown'),
  //       },
  //     ),
  //   )
  // }

  // if (options.formatters) {
  //   configs.push(formatters(
  //     options.formatters,
  //     typeof stylisticOptions === 'boolean' ? {} : stylisticOptions,
  //   ))
  // }

  configs.push(
    disables(),
  )

  if ('files' in options) {
    throw new Error('[@eienjs/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.')
  }

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options)
      acc[key] = options[key] as any
    return acc
  }, {} as TypedFlatConfigItem)
  if (Object.keys(fusedConfig).length)
    configs.push([fusedConfig])

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>()

  composer = composer
    .append(
      ...configs,
    )

  if (isInEditor) {
    composer = composer
      .disableRulesFix([
        'unused-imports/no-unused-imports',
        'test/no-only-tests',
        'prefer-const',
      ], {
        builtinRules: () => import(['eslint', 'use-at-your-own-risk'].join('/')).then(r => r.builtinRules),
      })
  }

  return composer
};

export type ResolvedOptions<T> = T extends boolean
  ? never
  : NonNullable<T>

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === 'boolean'
    ? {} as any
    : options[key] || {} as any
}

export function getOverrides<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): Partial<Linter.RulesRecord & RuleOptions> {
  const sub = resolveSubOptions(options, key)
  return {
    ...'overrides' in sub
      ? sub.overrides
      : {},
  }
}
