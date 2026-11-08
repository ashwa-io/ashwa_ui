// Fails the build when dist would break consumers: missing entries, unresolved @/ aliases
// (tsdown #833), or dev-only files leaking into the package.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import { ALIAS_IMPORT, DEV_ONLY } from './dist-rules.mjs';

const DIST = 'dist';
const ENTRIES = ['index.js', 'index.d.ts', 'theme.js', 'theme.d.ts'];

const walk = dir =>
  readdirSync(dir).flatMap(name => {
    const file = path.join(dir, name);
    return statSync(file).isDirectory() ? walk(file) : [file];
  });

const problems = ENTRIES.filter(entry => !existsSync(path.join(DIST, entry))).map(
  entry => `missing entry: dist/${entry}`
);

if (existsSync(DIST)) {
  walk(DIST).forEach(file => {
    if (DEV_ONLY.test(file)) problems.push(`dev-only file in dist: ${file}`);
    if (/\.(m?js|d\.ts)$/.test(file) && ALIAS_IMPORT.test(readFileSync(file, 'utf8'))) {
      problems.push(`unresolved @/ import: ${file}`);
    }
  });
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.warn(`dist OK (${walk(DIST).length} files)`);
