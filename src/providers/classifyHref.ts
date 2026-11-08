export type HrefKind = 'internal' | 'external' | 'blocked';

const BASE = 'http://internal.invalid';
const SAFE_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/**
 * Reads an href the way the browser will. A regex misreads `/\evil.com`, ` //evil.com` and
 * embedded tabs, which browsers treat as another host, and would let `javascript:` through.
 */
export const classifyHref = (href: string): HrefKind => {
  let url: URL;
  try {
    url = new URL(href, BASE);
  } catch {
    return 'blocked';
  }
  if (url.origin === BASE) return 'internal';
  return SAFE_SCHEMES.has(url.protocol) ? 'external' : 'blocked';
};
