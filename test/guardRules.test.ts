import { ESLint } from 'eslint';
import { beforeAll, describe, expect, it } from 'vitest';

const eslint = new ESLint({ cwd: process.cwd() });

const ruleIds = async (code: string, filePath: string): Promise<string[]> => {
  const [result] = await eslint.lintText(code, { filePath });
  return result.messages.map(message => message.ruleId ?? 'fatal');
};

const PUBLIC_FILE = 'src/components/atomic/Foo/Foo.tsx';
const UI_FILE = 'src/components/ui/foo.tsx';
const STORY_FILE = 'src/components/atomic/Foo/Foo.stories.tsx';

const propSnippet = (prop: string) => `export interface FooProps {\n  ${prop}?: string;\n}\n`;
const SPREAD_SNIPPET = `import React from 'react';

interface P {
  id: string;
}

export const Foo: React.FC<P> = props => <div {...props} />;
`;
const BASE_UI_SNIPPET = `import { Button } from '@base-ui/react/button';

export { Button };
`;

describe('public API guard rules', () => {
  // First lint loads every plugin (several seconds); keep it out of each test's timeout.
  beforeAll(async () => {
    await eslint.lintText('', { filePath: PUBLIC_FILE });
  }, 60_000);

  it.each(['className', 'style', 'asChild', 'render'])(
    'rejects %s in a public props interface',
    async prop => {
      expect(await ruleIds(propSnippet(prop), PUBLIC_FILE)).toContain('no-restricted-syntax');
    }
  );

  it('rejects JSX spread in public components', async () => {
    expect(await ruleIds(SPREAD_SNIPPET, PUBLIC_FILE)).toContain('no-restricted-syntax');
  });

  it('rejects direct Base UI import in public components', async () => {
    expect(await ruleIds(BASE_UI_SNIPPET, PUBLIC_FILE)).toContain('no-restricted-imports');
  });

  it('allows all of the above in src/components/ui', async () => {
    const ids = [
      ...(await ruleIds(propSnippet('className'), UI_FILE)),
      ...(await ruleIds(SPREAD_SNIPPET, UI_FILE)),
      ...(await ruleIds(BASE_UI_SNIPPET, UI_FILE)),
    ];
    expect(ids).not.toContain('no-restricted-syntax');
    expect(ids).not.toContain('no-restricted-imports');
  });

  it('allows spread in stories', async () => {
    expect(await ruleIds(SPREAD_SNIPPET, STORY_FILE)).not.toContain('no-restricted-syntax');
  });

  it('enforces arrow components everywhere', async () => {
    const code = 'export function Foo() {\n  return null;\n}\n';
    expect(await ruleIds(code, UI_FILE)).toContain('react/function-component-definition');
  });
});
