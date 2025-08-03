import type { ExtraLibrariesOption, FrameworkOption, PromItem } from './types';
import c from 'ansis';

export const vscodeSettingsString = `
  // Disable the default formatter, use eslint instead
  "prettier.enable": false,
  "editor.formatOnSave": false,
  "eslint.format.enable": true,
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.organizeImports": "never"
  },

  "eslint.runtime": "node",

  // Enable eslint for all supported languages
  "eslint.validate": [
    "javascript",
    "typescript",
    "vue",
    "html",
    "markdown",
    "json",
    "json5",
    "jsonc",
    "yaml",
    "toml",
    "xml",
    "astro",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss"
  ],
`;

export const frameworkOptions: PromItem<FrameworkOption>[] = [
  {
    label: c.green('Vue'),
    value: 'vue',
  },
  {
    label: c.magenta('Astro'),
    value: 'astro',
  },
  {
    label: c.blueBright('AdonisJS'),
    value: 'adonisjs',
  },
];

export const frameworks: FrameworkOption[] = frameworkOptions.map(({ value }) => (value));

export const extraOptions: PromItem<ExtraLibrariesOption>[] = [
  {
    hint: 'Use external formatters (Prettier) to format files that ESLint cannot handle yet (.css, .html, etc)',
    label: c.red('Formatter'),
    value: 'formatter',
  },
];

export const extra: ExtraLibrariesOption[] = extraOptions.map(({ value }) => (value));

export const dependenciesMap = {
  astro: [
    'eslint-plugin-astro',
    'astro-eslint-parser',
  ],
  formatter: [
    'eslint-plugin-format',
  ],
  formatterAstro: [
    'prettier-plugin-astro',
  ],
  vue: [],
  adonisjs: [
    '@adonisjs/eslint-plugin',
  ],
} as const;
