import { describe, expect, it } from 'vitest';

import { normalizeHex } from './colorHex';

describe('normalizeHex', () => {
  it('lowercases and keeps a 6-digit hex', () => {
    expect(normalizeHex('#1A73E8')).toBe('#1a73e8');
  });

  it('adds the missing #', () => {
    expect(normalizeHex('1a73e8')).toBe('#1a73e8');
  });

  it('ignores surrounding spaces', () => {
    expect(normalizeHex(' #1a73e8 ')).toBe('#1a73e8');
  });

  it.each(['#1a7', '#1a73e8ff', '#gggggg', '#1a73e', '', '#'])('rejects %j', input => {
    expect(normalizeHex(input)).toBeNull();
  });
});
