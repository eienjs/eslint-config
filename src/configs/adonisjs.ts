import type { OptionsAdonisJS, TypedFlatConfigItem } from '../types';
import { join } from 'pathe';
import { GLOB_SRC_EXT } from '../globs';
import { ensurePackages, interopDefault } from '../utils';

export async function adonisjs(
  options: OptionsAdonisJS = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    dirs = {},
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
  dirs.validators = dirs.validators || `${appPath}/validators`;
  dirs.policies = dirs.policies || `${appPath}/policies`;
  dirs.abilities = dirs.abilities || `${appPath}/abilities`;
  dirs.providers = dirs.providers || `${dirs.root}/providers`;
  dirs.database = dirs.database || `${dirs.root}/database`;
  dirs.bin = dirs.bin || `${dirs.root}/bin`;
  dirs.start = dirs.start || `${dirs.root}/start`;
  dirs.tests = dirs.tests || `${dirs.root}/tests`;
  dirs.config = dirs.config || `${dirs.root}/config`;
  dirs.commands = dirs.commands || `${dirs.root}/commands`;

  const nestedGlobPattern = `**/*.${GLOB_SRC_EXT}`;
  const fileRoutes = Object.values(dirs).map((dir) => join(dir, nestedGlobPattern));

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
      files: [fileRoutes],
      name: 'eienjs/adonisjs/disables',
      rules: {
        'antfu/no-top-level-await': 'off',
      },
    },
    {
      files: [join(dirs.database, nestedGlobPattern)],
      name: 'eienjs/adonisjs/database-disables',
      rules: {
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        'unicorn/no-anonymous-default-export': 'off',
      },
    },
    {
      files: [join(dirs.bin, nestedGlobPattern)],
      name: 'eienjs/adonisjs/bin-disables',
      rules: {
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        'unicorn/no-anonymous-default-export': 'off',
      },
    },
    {
      files: [join(dirs.commands, nestedGlobPattern)],
      name: 'eienjs/adonisjs/commands-disables',
      rules: {
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        'unicorn/no-anonymous-default-export': 'off',
      },
    },
    {
      files: [join(dirs.middleware, nestedGlobPattern)],
      name: 'eienjs/adonisjs/middleware-disables',
      rules: {
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        'unicorn/no-anonymous-default-export': 'off',
      },
    },
  ];
};
