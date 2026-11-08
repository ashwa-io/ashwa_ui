export type HrefKind = 'internal' | 'external' | 'blocked';

// Two schemes because `http:evil.com` is relative only on an http page: internal must hold on both.
const BASES = ['http://internal.invalid', 'https://internal.invalid'];
const SAFE_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/**
 * Reads an href the way the browser will. A regex misreads `/\evil.com`, ` //evil.com` and
 * embedded tabs, which browsers treat as another host, and would let `javascript:` through.
 */
export const classifyHref = (href: string): HrefKind => {
  let urls: URL[];
  try {
    urls = BASES.map(base => new URL(href, base));
  } catch {
    return 'blocked';
  }
  const elsewhere = urls.find((url, index) => url.origin !== BASES[index]);
  if (!elsewhere) return 'internal';
  return SAFE_SCHEMES.has(elsewhere.protocol) ? 'external' : 'blocked';
};
