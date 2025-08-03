import { execSync } from 'node:child_process';

export function isGitClean(): boolean {
  try {
    execSync('git diff-index --quiet HEAD --');

    return true;
  } catch {
    return false;
  }
}

export function getEslintConfigContent(
  mainConfig: string,
): string {
  return `
import eienjs from '@eienjs/eslint-config';

export default eienjs({
${mainConfig}
});
`.trimStart();
}
