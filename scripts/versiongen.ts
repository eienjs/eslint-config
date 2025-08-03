import fs from 'node:fs/promises';
import { parsePnpmWorkspaceYaml } from 'pnpm-workspace-yaml';
import { dependenciesMap } from '../src/cli/constants';

const names = new Set([
  'eslint',
  ...Object.values(dependenciesMap).flat(),
]);

const yaml = parsePnpmWorkspaceYaml(
  await fs.readFile(new URL('../pnpm-workspace.yaml', import.meta.url), 'utf8'),
).toJSON();

const catalogs = Object.values({
  default: yaml.catalog ?? {},
  ...yaml.catalogs,
});

const versions = [...names].map((name) => {
  const version = catalogs.map((c) => c[name]).find(Boolean);

  if (!version) {
    throw new Error(`Package ${name} not found`);
  }

  return [name, version];
}).sort((a, b) => a[0].localeCompare(b[0]));

const versionTemplate = `
export const versionsMap = {
${versions.map(([name, version]) => `  '${name}': '${version}',`).join('\n')}
};
`.trimStart();

await fs.writeFile(new URL('../src/cli/constants_generated.ts', import.meta.url), versionTemplate);
