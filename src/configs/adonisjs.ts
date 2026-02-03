import type { OptionsAdonisJS, TypedFlatConfigItem } from '../types';
import { join } from 'pathe';
import { GLOB_SRC_EXT } from '../globs';
import { ensurePackages, interopDefault } from '../utils';

export async function adonisjs(
  options: OptionsAdonisJS = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    dirs = {},
    overrides = {},
  } = options;

  await ensurePackages([
    '@adonisjs/eslint-plugin',
  ]);

  const pluginAdonisJS = await interopDefault(import('@adonisjs/eslint-plugin'));

  dirs.root = dirs.root || '.';
  const appPath = `${dirs.root}/app`;
  dirs.controllers = dirs.controllers || `${appPath}/controllers`;
  dirs.exceptions = dirs.exceptions || `${appPath}/exceptions`;
  dirs.models = dirs.models || `${appPath}/models`;
  dirs.mails = dirs.mails || `${appPath}/mails`;
  dirs.services = dirs.services || `${appPath}/services`;
  dirs.listeners = dirs.listeners || `${appPath}/listeners`;
  dirs.events = dirs.events || `${appPath}/events`;
  dirs.middleware = dirs.middleware || `${appPath}/middleware`;
  dirs.transformers = dirs.transformers || `${appPath}/transformers`;
  dirs.validators = dirs.validators || `${appPath}/validators`;
  dirs.providers = dirs.providers || `${dirs.root}/providers`;
  dirs.policies = dirs.policies || `${appPath}/policies`;
  dirs.abilities = dirs.abilities || `${appPath}/abilities`;
  dirs.database = dirs.database || `${dirs.root}/database`;
  dirs.bin = dirs.bin || `${dirs.root}/bin`;
  dirs.start = dirs.start || `${dirs.root}/start`;
  dirs.tests = dirs.tests || `${dirs.root}/tests`;
  dirs.config = dirs.config || `${dirs.root}/config`;
  dirs.commands = dirs.commands || `${dirs.root}/commands`;
  dirs.inertia = dirs.inertia || `${dirs.root}/inertia`;
  dirs.types = dirs.types || `${appPath}/types`;

  const nestedGlobPattern = `**/*.${GLOB_SRC_EXT}`;
  const fileRoutes = [...Object.values(dirs).map((dir) => join(dir, nestedGlobPattern)), `${dirs.root}/ace.js`];

  const commonRulesSet: TypedFlatConfigItem['rules'] = {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/require-await': 'off',
    'unicorn/no-anonymous-default-export': 'off',
  };

  return [
    {
      name: 'eienjs/adonisjs/rules',
      plugins: {
        '@adonisjs': pluginAdonisJS,
      },
      rules: {
        '@adonisjs/prefer-lazy-controller-import': 'error',
        '@adonisjs/prefer-lazy-listener-import': 'error',

        ...overrides,
      },
    },
    {
      files: [join(dirs.inertia, nestedGlobPattern)],
      name: 'eienjs/adonisjs/inertia-rules',
      rules: {
        '@adonisjs/no-backend-import-in-frontend': 'error',
        '@adonisjs/prefer-adonisjs-inertia-form': 'error',
        '@adonisjs/prefer-adonisjs-inertia-link': 'error',
      },
    },
    {
      files: fileRoutes,
      name: 'eienjs/adonisjs/disables',
      rules: {
        'antfu/no-top-level-await': 'off',
      },
    },
    {
      files: [join(dirs.database, nestedGlobPattern)],
      name: 'eienjs/adonisjs/database-disables',
      rules: {
        ...commonRulesSet,
      },
    },
    {
      files: [join(dirs.bin, nestedGlobPattern)],
      name: 'eienjs/adonisjs/bin-disables',
      rules: {
        ...commonRulesSet,
        '@typescript-eslint/no-misused-promises': 'off',
      },
    },
    {
      files: [join(dirs.commands, nestedGlobPattern)],
      name: 'eienjs/adonisjs/commands-disables',
      rules: {
        ...commonRulesSet,
      },
    },
    {
      files: [join(dirs.middleware, nestedGlobPattern)],
      name: 'eienjs/adonisjs/middleware-disables',
      rules: {
        ...commonRulesSet,
      },
    },
    {
      files: [join(dirs.transformers, nestedGlobPattern)],
      name: 'eienjs/adonisjs/transformers-disables',
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
    {
      files: [join(dirs.exceptions, nestedGlobPattern)],
      name: 'eienjs/adonisjs/exceptions-disables',
      rules: {
        ...commonRulesSet,
      },
    },
    {
      files: [join(dirs.controllers, nestedGlobPattern)],
      name: 'eienjs/adonisjs/controllers-disables',
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/require-await': 'off',
      },
    },
    {
      files: [join(dirs.config, nestedGlobPattern)],
      name: 'eienjs/adonisjs/config-disables',
      rules: {
        '@typescript-eslint/consistent-type-definitions': 'off',
      },
    },
    {
      files: [join(dirs.providers, nestedGlobPattern)],
      name: 'eienjs/adonisjs/providers-disables',
      rules: {
        '@typescript-eslint/consistent-type-definitions': 'off',
      },
    },
    {
      files: [join(dirs.tests, nestedGlobPattern)],
      name: 'eienjs/adonisjs/tests-disables',
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/unbound-method': 'off',
      },
    },
    {
      files: [join(dirs.types, nestedGlobPattern)],
      name: 'eienjs/adonisjs/types-disables',
      rules: {
        '@eslint-community/eslint-comments/no-unlimited-disable': 'off',
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
  ];
};
