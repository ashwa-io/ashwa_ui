import { describe, expect, it } from 'vitest';

import { initials } from './initials';

describe('initials', () => {
  it.each([
    ['Aarav Sharma', 'AS'],
    ['Aarav', 'A'],
    ['  aarav   sharma  ', 'AS'],
    ['Aarav Kumar Sharma', 'AK'],
    ['', ''],
    ['आरव शर्मा', 'आश'],
    ['😀 Smile', '😀S'],
  ])('%j → %j', (name, expected) => {
    expect(initials(name)).toBe(expected);
  });
});
