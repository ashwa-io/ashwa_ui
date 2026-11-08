import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const PUBLIC_LAYERS = ['atomic', 'molecule', 'organism', 'layout'];

const componentFolders = (): string[] =>
  PUBLIC_LAYERS.map(layer => path.join('src/components', layer))
    .filter(dir => existsSync(dir))
    .flatMap(dir => readdirSync(dir).map(name => path.join(dir, name)))
    .filter(dir => statSync(dir).isDirectory());

describe('public component folders', () => {
  it('has at least one component', () => {
    expect(componentFolders().length).toBeGreaterThan(0);
  });

  // The typetest is what proves className/style stay rejected; the story runs a11y + play tests.
  it.each(componentFolders())('%s ships component, story, typetest and barrel', dir => {
    const name = path.basename(dir);
    ['.tsx', '.stories.tsx', '.typetest.tsx'].forEach(suffix =>
      expect(existsSync(path.join(dir, `${name}${suffix}`)), `${name}${suffix}`).toBe(true)
    );
    expect(existsSync(path.join(dir, 'index.ts')), 'index.ts').toBe(true);
  });

  it.each(componentFolders())('%s is exported from src/index.ts', dir => {
    expect(readFileSync('src/index.ts', 'utf8')).toMatch(new RegExp(`\\b${path.basename(dir)}\\b`));
  });
});
