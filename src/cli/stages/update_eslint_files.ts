import type { PromptResult } from '../types';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import * as p from '@clack/prompts';
import c from 'ansis';
// @ts-expect-error missing types
import parse from 'parse-gitignore';
import { getEslintConfigContent } from '../utils';

export async function updateEslintFiles(result: PromptResult): Promise<void> {
  const cwd = process.cwd();
  const pathESLintIgnore = path.join(cwd, '.eslintignore');
  const pathPackageJSON = path.join(cwd, 'package.json');

  const pkgContent = await fsp.readFile(pathPackageJSON, 'utf8');
  const pkg = JSON.parse(pkgContent) as Record<string, any>;

  const configFileName = pkg.type === 'module' ? 'eslint.config.js' : 'eslint.config.mjs';
  const pathFlatConfig = path.join(cwd, configFileName);

  const eslintIgnores: string[] = [];
  if (fs.existsSync(pathESLintIgnore)) {
    p.log.step(c.cyan`Migrating existing .eslintignore`);
    const content = await fsp.readFile(pathESLintIgnore, 'utf8');
    const parsed = (parse as ((content: string) => { globs: () => { type: string; patterns: string[] }[] }))(content);
    const globs = parsed.globs();

    for (const glob of globs) {
      if (glob.type === 'ignore') {
        eslintIgnores.push(...glob.patterns);
      } else if (glob.type === 'unignore') {
        eslintIgnores.push(...glob.patterns.map((pattern: string) => `!${pattern}`));
      }
    }
  }

  const configLines: string[] = [];

  if (eslintIgnores.length > 0) {
    configLines.push(`ignores: ${JSON.stringify(eslintIgnores)},`);
  }

  if (result.extra.includes('formatter')) {
    configLines.push('formatters: true,');
  }

  for (const framework of result.frameworks) {
    configLines.push(`${framework}: true,`);
  }

  const mainConfig = configLines.map((i) => `  ${i}`).join('\n');

  const eslintConfigContent: string = getEslintConfigContent(mainConfig);

  await fsp.writeFile(pathFlatConfig, eslintConfigContent);
  p.log.success(c.green`Created ${configFileName}`);

  const files = fs.readdirSync(cwd);
  const legacyConfig: string[] = [];
  for (const file of files) {
    if (/eslint|prettier/.test(file) && !/eslint\.config\./.test(file)) {
      legacyConfig.push(file);
    }
  }

  if (legacyConfig.length > 0) {
    p.note(c.dim(legacyConfig.join(', ')), 'You can now remove those files manually');
  }
}
