import type { PromptResult } from '../types';
import fsp from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import * as p from '@clack/prompts';
import c from 'ansis';
import { version } from '../../../package.json';
import { dependenciesMap } from '../constants';
import { versionsMap } from '../constants_generated';

export async function updatePackageJson(result: PromptResult): Promise<void> {
  const cwd = process.cwd();
  const pathPackageJSON = path.join(cwd, 'package.json');

  p.log.step(c.cyan`Bumping @eienjs/eslint-config to v${version}`);

  const pkgContent = await fsp.readFile(pathPackageJSON, 'utf8');
  const pkg = JSON.parse(pkgContent) as { devDependencies?: Record<string, unknown> };

  pkg.devDependencies = pkg.devDependencies ?? {};
  pkg.devDependencies['@eienjs/eslint-config'] = `^${version}`;
  pkg.devDependencies.eslint = pkg.devDependencies.eslint ?? versionsMap.eslint;

  const addedPackages: string[] = [];

  if (result.extra.length > 0) {
    const extraPackages = result.extra;

    for (const item of extraPackages) {
      switch (item) {
        case 'formatter': {
          for (const f of ([
            ...dependenciesMap.formatter,
            ...(result.frameworks.includes('astro') ? dependenciesMap.formatterAstro : []),
          ] as const)) {
            if (!f) {
              continue;
            }

            pkg.devDependencies[f] = versionsMap[f as keyof typeof versionsMap];
            addedPackages.push(f);
          }
          break;
        }
      }
    }
  }

  for (const framework of result.frameworks) {
    const deps = dependenciesMap[framework];
    if (deps.length > 0) {
      for (const f of deps) {
        pkg.devDependencies[f] = versionsMap[f as keyof typeof versionsMap];
        addedPackages.push(f);
      }
    }
  }

  if (addedPackages.length > 0) {
    p.note(c.dim(addedPackages.join(', ')), 'Added packages');
  }

  await fsp.writeFile(pathPackageJSON, JSON.stringify(pkg, null, 2));
  p.log.success(c.green`Changes wrote to package.json`);
}
