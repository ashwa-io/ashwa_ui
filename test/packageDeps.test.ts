import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

interface PackageJson {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as PackageJson;
const css = readFileSync('src/styles/index.css', 'utf8');

// Package name of a bare CSS import: '@scope/name/sub' -> '@scope/name', 'name/sub' -> 'name'.
const packageName = (specifier: string): string =>
  specifier
    .split('/')
    .slice(0, specifier.startsWith('@') ? 2 : 1)
    .join('/');

describe('published CSS', () => {
  it('only imports packages consumers are guaranteed to have', () => {
    const bare = [...css.matchAll(/@import\s+['"]([^'"]+)['"]/g)]
      .map(([, specifier]) => specifier)
      .filter(specifier => !specifier.startsWith('.'));
    expect(bare.length).toBeGreaterThan(0);
    bare.forEach(specifier => {
      const name = packageName(specifier);
      expect(
        { ...pkg.dependencies, ...pkg.peerDependencies }[name],
        `${name} must be a dependency or peerDependency`
      ).toBeDefined();
    });
  });

  it('requires Tailwind v4 from the consumer', () => {
    expect(pkg.peerDependencies?.tailwindcss).toBe('^4');
  });
});
