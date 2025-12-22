import type { OptionsConfig } from './types';

// @keep-sorted
export const CONFIG_PRESET_FULL_ON: OptionsConfig = {
  adonisjs: true,
  astro: true,
  formatters: true,
  gitignore: true,
  imports: true,
  jsdoc: true,
  jsonc: true,
  markdown: true,
  node: true,
  nuxt: true,
  pnpm: true,
  regexp: true,
  stylistic: {
    experimental: true,
  },
  test: true,
  toml: true,
  typescript: {
    erasableSyntaxOnly: true,
    tsconfigPath: 'tsconfig.json',
  },
  unicorn: true,
  vue: true,
  yaml: true,
};

export const CONFIG_PRESET_FULL_OFF: OptionsConfig = {
  adonisjs: false,
  astro: false,
  formatters: false,
  gitignore: false,
  imports: false,
  jsdoc: false,
  jsonc: false,
  markdown: false,
  node: false,
  nuxt: false,
  pnpm: false,
  regexp: false,
  stylistic: false,
  test: false,
  toml: false,
  typescript: false,
  unicorn: false,
  vue: false,
  yaml: false,
};
