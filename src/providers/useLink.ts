import { createContext, useContext } from 'react';
import type React from 'react';

import { classifyHref } from './classifyHref';

export interface RouterAdapter {
  navigate?: (href: string) => void;
  useHref?: (href: string) => string;
}

export const RouterContext = createContext<RouterAdapter>({});

const identity = (href: string) => href;

/** Anchor props for an internal or external href; internal clicks go through the app's router. */
export const useLink = (href: string | undefined) => {
  const { navigate, useHref = identity } = useContext(RouterContext);
  const resolved = useHref(href ?? '');
  const kind = href === undefined ? undefined : classifyHref(href);
  const external = kind === 'external';

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    // Only hrefs the browser reads as same-origin may reach the app's router.
    if (href === undefined || kind !== 'internal' || !navigate || event.defaultPrevented) return;
    // Modified and middle clicks belong to the browser: new tab or window.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    navigate(href);
  };

  return {
    href: href === undefined || kind === 'blocked' ? undefined : resolved,
    target: external ? ('_blank' as const) : undefined,
    rel: external ? 'noopener noreferrer' : undefined,
    onClick,
  };
};
