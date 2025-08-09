import type { TypedFlatConfigItem } from '../types';
import { GLOB_EXCLUDE } from '../globs';

export function ignores(userIgnores: string[] = []): TypedFlatConfigItem[] {
  return [
    {
      ignores: [
        ...GLOB_EXCLUDE,
        ...userIgnores,
      ],
      name: 'eienjs/ignores',
    },
  ];
}
