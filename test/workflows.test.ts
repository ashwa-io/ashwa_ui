import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const release = readFileSync('.github/workflows/release.yml', 'utf8');

describe('release workflow', () => {
  // Trusted publishing makes every merged version bump live, so the same gates as CI
  // must pass in this job before npm publish.
  it.each(['yarn lint', 'yarn typecheck', 'yarn test', 'playwright install'])(
    'runs %s before npm publish',
    command => {
      const gate = release.indexOf(command);
      expect(gate).toBeGreaterThan(-1);
      expect(gate).toBeLessThan(release.indexOf('npm publish'));
    }
  );

  it('uses OIDC, not a stored token', () => {
    expect(release).toContain('id-token: write');
    expect(release).not.toContain('NPM_TOKEN');
    expect(release).not.toContain('NODE_AUTH_TOKEN');
  });
});
