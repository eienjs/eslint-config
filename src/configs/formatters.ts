import type { OptionsFormatters, StylisticConfig, TypedFlatConfigItem } from '../types';
import type { VendoredPrettierOptions, VendoredPrettierRuleOptions } from '../vendored/prettier_types';
import { GLOB_ASTRO, GLOB_ASTRO_TS, GLOB_CSS, GLOB_HTML, GLOB_LESS, GLOB_MARKDOWN, GLOB_POSTCSS, GLOB_SCSS, GLOB_SVG, GLOB_XML } from '../globs';
import { ensurePackages, interopDefault, isPackageInScope, parserPlain } from '../utils';
import { StylisticConfigDefaults } from './stylistic';

function mergePrettierOptions(
  options: VendoredPrettierOptions,
  overrides: VendoredPrettierRuleOptions = {},
): VendoredPrettierRuleOptions {
  return {
    ...options,
    ...overrides,
    plugins: [
      ...(overrides.plugins ?? []),
      ...(options.plugins ?? []),
    ],
  };
}

export async function formatters(
  options: OptionsFormatters | true = {},
  stylistic: StylisticConfig = {},
): Promise<TypedFlatConfigItem[]> {
  if (options === true) {
    const isPrettierPluginXmlInScope = isPackageInScope('@prettier/plugin-xml');
    options = {
      astro: isPackageInScope('prettier-plugin-astro'),
      css: true,
      html: true,
      markdown: true,
      svg: isPrettierPluginXmlInScope,
      xml: isPrettierPluginXmlInScope,
    };
  }

  await ensurePackages([
    'eslint-plugin-format',
    options.astro ? 'prettier-plugin-astro' : undefined,
    (options.xml || options.svg) ? '@prettier/plugin-xml' : undefined,
  ]);

  const {
    indent,
    quotes,
  } = {
    ...StylisticConfigDefaults,
    ...stylistic,
  };

  const prettierOptions: VendoredPrettierOptions = Object.assign(
    {
      arrowParens: 'always',
      endOfLine: 'lf',
      printWidth: 120,
      semi: true,
      singleQuote: quotes === 'single',
      tabWidth: typeof indent === 'number' ? indent : 2,
      trailingComma: 'all',
      useTabs: indent === 'tab',
    } satisfies VendoredPrettierOptions,
    options.prettierOptions ?? {},
  );

  const prettierXmlOptions: VendoredPrettierOptions = {
    xmlQuoteAttributes: 'double',
    xmlSelfClosingSpace: true,
    xmlSortAttributesByKey: false,
    xmlWhitespaceSensitivity: 'ignore',
  };

  const pluginFormat = await interopDefault(import('eslint-plugin-format'));

  const configs: TypedFlatConfigItem[] = [
    {
      name: 'eienjs/formatter/setup',
      plugins: {
        format: pluginFormat,
      },
    },
  ];

  if (options.css) {
    configs.push(
      {
        files: [GLOB_CSS, GLOB_POSTCSS],
        languageOptions: {
          parser: parserPlain,
        },
        name: 'eienjs/formatter/css',
        rules: {
          'format/prettier': [
            'error',
            mergePrettierOptions(prettierOptions, {
              parser: 'css',
            }),
          ],
        },
      },
      {
        files: [GLOB_SCSS],
        languageOptions: {
          parser: parserPlain,
        },
        name: 'eienjs/formatter/scss',
        rules: {
          'format/prettier': [
            'error',
            mergePrettierOptions(prettierOptions, {
              parser: 'scss',
            }),
          ],
        },
      },
      {
        files: [GLOB_LESS],
        languageOptions: {
          parser: parserPlain,
        },
        name: 'eienjs/formatter/less',
        rules: {
          'format/prettier': [
            'error',
            mergePrettierOptions(prettierOptions, {
              parser: 'less',
            }),
          ],
        },
      },
    );
  }

  if (options.html) {
    configs.push({
      files: [GLOB_HTML],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'eienjs/formatter/html',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(prettierOptions, {
            parser: 'html',
          }),
        ],
      },
    });
  }

  if (options.xml) {
    configs.push({
      files: [GLOB_XML],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'eienjs/formatter/xml',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions({ ...prettierXmlOptions, ...prettierOptions }, {
            parser: 'xml',
            plugins: [
              '@prettier/plugin-xml',
            ],
          }),
        ],
      },
    });
  }
  if (options.svg) {
    configs.push({
      files: [GLOB_SVG],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'eienjs/formatter/svg',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions({ ...prettierXmlOptions, ...prettierOptions }, {
            parser: 'xml',
            plugins: [
              '@prettier/plugin-xml',
            ],
          }),
        ],
      },
    });
  }

  if (options.markdown) {
    configs.push({
      files: [GLOB_MARKDOWN],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'eienjs/formatter/markdown',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(prettierOptions, {
            embeddedLanguageFormatting: 'off',
            parser: 'markdown',
          }),
        ],
      },
    });
  }

  if (options.astro) {
    configs.push({
      files: [GLOB_ASTRO],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'eienjs/formatter/astro',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(prettierOptions, {
            parser: 'astro',
            plugins: [
              'prettier-plugin-astro',
            ],
          }),
        ],
      },
    }, {
      files: [GLOB_ASTRO, GLOB_ASTRO_TS],
      name: 'eienjs/formatter/astro/disables',
      rules: {
        '@stylistic/arrow-parens': 'off',
        '@stylistic/block-spacing': 'off',
        '@stylistic/comma-dangle': 'off',
        '@stylistic/indent': 'off',
        '@stylistic/no-multi-spaces': 'off',
        '@stylistic/quotes': 'off',
        '@stylistic/semi': 'off',
      },
    });
  }

  return configs;
}
