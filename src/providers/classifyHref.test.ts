import { describe, expect, it } from 'vitest';

import { classifyHref } from './classifyHref';

describe('classifyHref', () => {
  it.each(['/vehicles', '/a/b?c=1#d', 'relative/path', '#top', '?page=2'])(
    '%j is internal',
    href => {
      expect(classifyHref(href)).toBe('internal');
    }
  );

  it.each([
    'https://ashwa.io/help',
    'http://ashwa.io',
    'mailto:help@ashwa.io',
    'tel:+911234567890',
    // Browsers read all of these as another host: they must never reach the app's router.
    '//evil.com',
    '/\\evil.com',
    '\\\\evil.com',
    ' //evil.com',
    '/\t/evil.com',
    '\thttps://evil.com',
    // A scheme with no slashes is relative only when it matches the page's own scheme.
    'http:evil.com',
    'https:evil.com',
    'http:/evil.com',
    'HTTP:evil.com',
    'http://internal.invalid/x',
    'https://internal.invalid/x',
  ])('%j is external', href => {
    expect(classifyHref(href)).toBe('external');
  });

  it.each([
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    ' javascript:alert(1)',
    'java\tscript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'file:///etc/passwd',
    'http://',
  ])('%j is blocked', href => {
    expect(classifyHref(href)).toBe('blocked');
  });
});
