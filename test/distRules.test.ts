import { describe, expect, it } from 'vitest';

import { ALIAS_IMPORT, DEV_ONLY } from '../scripts/dist-rules.mjs';

describe('check-dist rules', () => {
  it.each([
    "import { Button } from '@/components/ui/button';",
    'export * from "@/lib/types";',
    'export{cn}from"@/lib/utils";',
    "const m = await import('@/theme');",
    'import "@/components/atomic/Button/index.js";',
    "import '@/styles/index.css';",
  ])('flags unresolved alias: %s', line => {
    expect(ALIAS_IMPORT.test(line)).toBe(true);
  });

  it.each([
    "import { Button } from '@base-ui/react/button';",
    "import { cn } from 'cn';",
    'import "./components/atomic/Button/index.js";',
    "export { Button } from '@ashwa-io/ui';",
  ])('allows resolved import: %s', line => {
    expect(ALIAS_IMPORT.test(line)).toBe(false);
  });

  it('flags dev-only files', () => {
    expect(DEV_ONLY.test('dist/components/atomic/Button/Button.stories.js')).toBe(true);
    expect(DEV_ONLY.test('dist/components/atomic/Button/Button.js')).toBe(false);
  });
});
