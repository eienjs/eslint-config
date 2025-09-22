import type { Awaitable, TypedFlatConfigItem } from './types';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { isPackageExists } from 'local-pkg';

const scopeUrl = fileURLToPath(new URL('.', import.meta.url));
const isCwdInScope = isPackageExists('@eienjs/eslint-config');

export const parserPlain = {
  meta: {
    name: 'parser-plain',
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  parseForESLint: (code: string) => ({
    ast: {
      body: [],
      comments: [],
      loc: { end: code.length, start: 0 },
      range: [0, code.length],
      tokens: [],
      type: 'Program',
    },
    scopeManager: null,
    services: { isPlain: true },
    visitorKeys: {
      Program: [],
    },
  }),
};

/**
 * Combine array and non-array configs into a single array.
 */
export async function combine(
  ...configs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]
): Promise<TypedFlatConfigItem[]> {
  const resolved = await Promise.all(configs as Promise<TypedFlatConfigItem | TypedFlatConfigItem[]>[]);

  return resolved.flat();
}

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  return (resolved as any).default || resolved;
}

export function isPackageInScope(name: string): boolean {
  return isPackageExists(name, { paths: [scopeUrl] });
}

export async function ensurePackages(packages: (string | undefined)[]): Promise<void> {
  if (process.env.CI || !process.stdout.isTTY || !isCwdInScope) {
    return;
  }

  const nonExistingPackages = packages.filter((i) => i && !isPackageInScope(i)) as string[];
  if (nonExistingPackages.length === 0) {
    return;
  }

  const p = await import('@clack/prompts');
  const packagesMissing = nonExistingPackages.join(', ');
  const packagesMissingPlural = nonExistingPackages.length === 1 ? 'Package is' : 'Packages are';
  const result = await p.confirm({
    message: `${packagesMissingPlural} required for this config: ${packagesMissing}. Do you want to install them?`,
  });

  if (result) {
    await import('@antfu/install-pkg').then(async (i) => i.installPackage(nonExistingPackages, { dev: true }));
  }
}

export function isInEditorEnv(): boolean {
  if (process.env.CI) {
    return false;
  }

  if (isInGitHooksOrLintStaged()) {
    return false;
  }

  return Boolean(
    process.env.VSCODE_PID
    || process.env.VSCODE_CWD
    || process.env.JETBRAINS_IDE
    || process.env.VIM
    || process.env.NVIM,
  );
}

export function isInGitHooksOrLintStaged(): boolean {
  return Boolean(process.env.GIT_PARAMS
    || process.env.VSCODE_GIT_COMMAND
    || process.env.npm_lifecycle_script?.startsWith('lint-staged'));
}
