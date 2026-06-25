import type { TypedFlatConfigItem } from '../types';
import { GLOB_EXCLUDE, GLOB_TS, GLOB_TSX } from '../globs';

export function ignores(
  userIgnores: string[] | ((originals: string[]) => string[]) = [],
  shouldIgnoreTypescript = false,
): TypedFlatConfigItem[] {
  let ignores = [
    ...GLOB_EXCLUDE,
  ];

  if (shouldIgnoreTypescript) {
    ignores.push(GLOB_TS, GLOB_TSX);
  }

  ignores = typeof userIgnores === 'function'
    ? userIgnores(ignores)
    : [
        ...ignores,
        ...userIgnores,
      ];

  return [
    {
      ignores,
      name: 'eienjs/ignores',
    },
  ];
}
