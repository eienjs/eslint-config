import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';
import type { ParserOptions } from '@typescript-eslint/parser';
import type { Linter } from 'eslint';
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks';
import type { ConfigNames, RuleOptions } from './typegen';
import type { VendoredPrettierOptions } from './vendored/prettier_types';

export type Awaitable<T> = T | Promise<T>;

export type Rules = Record<string, Linter.RuleEntry | undefined> & RuleOptions;

export type { ConfigNames };

/**
 * An updated version of ESLint's `Linter.Config`, which provides autocompletion
 * for `rules` and relaxes type limitations for `plugins` and `rules`, because
 * many plugins still lack proper type definitions.
 */
export type TypedFlatConfigItem = Omit<Linter.Config, 'plugins' | 'rules'> & {
  /**
   * An object containing a name-value mapping of plugin names to plugin objects.
   * When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, unknown>;

  /**
   * An object containing the configured rules. When `files` or `ignores` are
   * specified, these rule configurations are only available to the matching files.
   */
  rules?: Rules;
};

export interface OptionsErasableSyntaxOnly {
  /**
   * Enable/disable erasable syntax only rules for enums.
   *
   * @default true when `erableSyntaxOnly` is enabled
   */
  enums?: boolean;

  /**
   * Enable/disable erasable syntax only rules for parameter properties.
   *
   * @default true when `erableSyntaxOnly` is enabled
   */
  parameterProperties?: boolean;
}

export interface OptionsNuxt extends OptionsOverrides {
  /**
   * Version of Nuxt
   *
   * @default 4
   */
  version?: 3 | 4;

  /**
   * Sort keys in nuxt.config to maintain a consistent order
   *
   * @default true when `stylistic` is enabled
   */
  sortConfigKeys?: boolean;

  dirs?: {
    /**
     * Nuxt source directory
     */
    src?: string[];

    /**
     * Root directory for nuxt project
     */
    root?: string[];

    /**
     * Directory for pages
     */
    pages?: string[];

    /**
     * Directory for layouts
     */
    layouts?: string[];

    /**
     * Directory for components
     */
    components?: string[];

    /**
     * Directory for components with prefix
     * Ignore `vue/multi-word-component-names`
     */
    componentsPrefixed?: string[];

    /**
     * Directory for composobles
     */
    composables?: string[];

    /**
     * Directory for plugins
     */
    plugins?: string[];

    /**
     * Directory for modules
     */
    modules?: string[];

    /**
     * Directory for middleware
     */
    middleware?: string[];

    /**
     * Directory for server
     */
    servers?: string[];

    /**
     * Directory for utils
     */
    utils?: string[];
  };
}

export interface OptionsAdonisJS extends OptionsOverrides {
  /**
   * Override the `dirs` option to provide custom directories of adonisjs app.
   */
  dirs?: {
    root?: string;
    bin?: string;
    controllers?: string;
    exceptions?: string;
    models?: string;
    mails?: string;
    services?: string;
    listeners?: string;
    events?: string;
    middleware?: string;
    validators?: string;
    providers?: string;
    policies?: string;
    abilities?: string;
    database?: string;
    start?: string;
    tests?: string;
    config?: string;
    commands?: string;
  };
}

export interface OptionsVue extends OptionsOverrides {
  /**
   * Create virtual files for Vue SFC blocks to enable linting.
   *
   * @see https://github.com/antfu/eslint-processor-vue-blocks
   * @default true
   */
  sfcBlocks?: boolean | VueBlocksOptions;
  /**
   * Only check registered components in template casing.
   *
   * @default false
   */
  componentNameInTemplateCasingOnlyRegistered?: boolean;
  /**
   * Ignored components in template casing.
   *
   * @default []
   */
  componentNameInTemplateCasingIgnores?: string[];

  /**
   * Global components in template casing.
   *
   * @default []
   */
  componentNameInTemplateCasingGlobals?: string[];
}

export type OptionsTypescript
  = (OptionsTypeScriptWithTypes & OptionsOverrides & OptionsTypescriptWithErasableSyntaxOnly)
    | (OptionsTypeScriptParserOptions & OptionsOverrides & OptionsTypescriptWithErasableSyntaxOnly);

export interface OptionsFormatters {
  /**
   * Enable formatting support for CSS, Less, Sass, and SCSS.
   *
   * Currently only support Prettier.
   */
  css?: 'prettier' | boolean;

  /**
   * Enable formatting support for HTML.
   *
   * Currently only support Prettier.
   */
  html?: 'prettier' | boolean;

  /**
   * Enable formatting support for XML.
   *
   * Currently only support Prettier.
   */
  xml?: 'prettier' | boolean;

  /**
   * Enable formatting support for SVG.
   *
   * Currently only support Prettier.
   */
  svg?: 'prettier' | boolean;

  /**
   * Enable formatting support for Markdown.
   *
   * Support both Prettier and dprint.
   *
   * When set to `true`, it will use Prettier.
   */
  markdown?: 'prettier' | boolean;

  /**
   * Custom options for Prettier.
   *
   * By default it's controlled by our own config.
   */
  prettierOptions?: VendoredPrettierOptions;

  /**
   * Enable formatting support for Astro.
   *
   * Currently only support Prettier.
   */
  astro?: 'prettier' | boolean;
}

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ['vue']
   * @default []
   */
  componentExts?: string[];
}

export interface OptionsTypeScriptParserOptions {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>;

  /**
   * Glob patterns for files that should be type aware.
   * @default ['**\/*.{ts,tsx}']
   */
  filesTypeAware?: string[];

  /**
   * Glob patterns for files that should not be type aware.
   * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
   */
  ignoresTypeAware?: string[];
}

export interface OptionsTypescriptWithErasableSyntaxOnly {
  /**
   * Enable erasable syntax only rules.
   *
   * @default false
   */
  erasableSyntaxOnly?: boolean | OptionsErasableSyntaxOnly;
}

export interface OptionsTypeScriptWithTypes {
  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string;

  /**
   * Override type aware rules.
   */
  overridesTypeAware?: TypedFlatConfigItem['rules'];
}

export interface OptionsHasTypeScript {
  typescript?: boolean;
}

export interface OptionsStylistic {
  stylistic?: boolean | StylisticConfig;
}

export interface StylisticConfig
  extends Pick<StylisticCustomizeOptions, 'indent' | 'quotes' | 'experimental'> {
  maxLineLength?: number;
}

export interface OptionsOverrides {
  overrides?: TypedFlatConfigItem['rules'];
}

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[];
}

export interface OptionsRegExp {
  /**
   * Override rulelevels
   */
  level?: 'error' | 'warn';
}

export interface OptionsIsInEditor {
  isInEditor?: boolean;
}

export interface OptionsPnpm extends OptionsIsInEditor {
  /**
   * Requires catalogs usage
   *
   * Detects automatically based if `catalogs` is used in the pnpm-workspace.yaml file
   */
  catalogs?: boolean;

  /**
   * Enable linting for package.json, will install the jsonc parser
   *
   * @default true
   */
  json?: boolean;

  /**
   * Enable linting for pnpm-workspace.yaml, will install the yaml parser
   *
   * @default true
   */
  yaml?: boolean;

  /**
   * Sort entries in pnpm-workspace.yaml
   *
   * @default false
   */
  sort?: boolean;
}

export interface OptionsConfig extends OptionsComponentExts {
  /**
   * Enable gitignore support.
   *
   * Passing an object to configure the options.
   *
   * @see https://github.com/antfu/eslint-config-flat-gitignore
   * @default true
   */
  gitignore?: boolean | FlatGitignoreOptions;

  /**
   * Extend the global ignores.
   *
   * Passing an array to extends the ignores.
   * Passing a function to modify the default ignores.
   *
   * @default []
   */
  ignores?: string[] | ((originals: string[]) => string[]);

  /**
   * Core rules. Can't be disabled.
   */
  javascript?: OptionsOverrides;

  /**
   * Enable Node.js rules
   *
   * @default true
   */
  node?: boolean;

  /**
   * Enable JSDoc rules
   *
   * @default true
   */
  jsdoc?: boolean;

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | OptionsTypescript;

  /**
   * Options for eslint-plugin-unicorn.
   *
   * @default true
   */
  unicorn?: boolean | OptionsOverrides;

  /**
   * Options for eslint-plugin-import-lite.
   *
   * @default true
   */
  imports?: boolean | OptionsOverrides;

  /**
   * Enable test support.
   *
   * @default true
   */
  test?: boolean | OptionsOverrides;

  /**
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean | OptionsVue;

  /**
   * Enable JSONC support.
   *
   * @default true
   */
  jsonc?: boolean | OptionsOverrides;

  /**
   * Enable YAML support.
   *
   * @default true
   */
  yaml?: boolean | OptionsOverrides;

  /**
   * Enable TOML support.
   *
   * @default true
   */
  toml?: boolean | OptionsOverrides;

  /**
   * Enable ASTRO support.
   *
   * Requires installing:
   * - `eslint-plugin-astro`
   *
   * Requires installing for formatting .astro:
   * - `prettier-plugin-astro`
   *
   * @default false
   */
  astro?: boolean | OptionsOverrides;

  /**
   * Enable linting for **code snippets** in Markdown.
   *
   * For formatting Markdown content, enable also `formatters.markdown`.
   *
   * @default true
   */
  markdown?: boolean | OptionsOverrides;

  /**
   * Enable stylistic rules.
   *
   * @see https://eslint.style/
   * @default true
   */
  stylistic?: boolean | (StylisticConfig & OptionsOverrides);

  /**
   * Enable regexp rules.
   *
   * @see https://ota-meshi.github.io/eslint-plugin-regexp/
   * @default true
   */
  regexp?: boolean | (OptionsRegExp & OptionsOverrides);

  /**
   * Enable pnpm (workspace/catalogs) support.
   *
   * Currently it's disabled by default, as it's still experimental.
   * In the future it will be smartly enabled based on the project usage.
   *
   * @see https://github.com/antfu/pnpm-workspace-utils
   * @experimental
   * @default false
   */
  pnpm?: boolean | OptionsPnpm;

  /**
   * Use external formatters to format files.
   *
   * Requires installing:
   * - `eslint-plugin-format`
   *
   * When set to `true`, it will enable all formatters.
   *
   * @default false
   */
  formatters?: boolean | OptionsFormatters;

  /**
   * Control to disable some rules in editors.
   * @default auto-detect based on the process.env
   */
  isInEditor?: boolean;

  /**
   * Enable AdonisJS support.
   *
   * Requires installing:
   * - `@adonisjs/eslint-plugin`
   *
   * @default false
   */
  adonisjs?: boolean | OptionsAdonisJS;

  /**
   * Enable Nuxt support.
   *
   * Requires installing:
   * - `@nuxt/eslint-plugin`
   *
   * @default false
   */
  nuxt?: boolean | OptionsNuxt;
}
