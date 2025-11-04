import type { TypedFlatConfigItem } from '../types';
import { GLOB_EXCLUDE } from '../globs';

export function ignores(userIgnores: string[] | ((originals: string[]) => string[]) = []): TypedFlatConfigItem[] {
  let ignores = [
    ...GLOB_EXCLUDE,
  ];

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
