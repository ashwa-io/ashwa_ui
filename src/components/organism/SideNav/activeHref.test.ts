import { describe, expect, it } from 'vitest';

import { activeHref } from './activeHref';

describe('activeHref', () => {
  it.each([
    [['/admin', '/admin/users'], '/admin/users/5', '/admin/users'],
    [['/admin', '/admin/users'], '/admin', '/admin'],
    [['/admin'], '/adminx', null],
    [['/'], '/', '/'],
    [['/'], '/x', null],
    [['/', '/a'], '/a', '/a'],
    [['/admin'], '/admin/', '/admin'],
    [['/admin/'], '/admin', '/admin/'],
    [[], '/admin', null],
  ])('%j at %j → %j', (hrefs, path, expected) => {
    expect(activeHref(hrefs as string[], path as string)).toBe(expected);
  });
});
