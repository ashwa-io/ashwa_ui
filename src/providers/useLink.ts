import { createContext, useContext } from 'react';
import type React from 'react';

export interface RouterAdapter {
  navigate?: (href: string) => void;
  useHref?: (href: string) => string;
}

export const RouterContext = createContext<RouterAdapter>({});

const identity = (href: string) => href;

// Has a scheme (https:, mailto:) or is protocol-relative (//host).
const EXTERNAL = /^([a-z][a-z0-9+.-]*:|\/\/)/i;

/** Anchor props for an internal or external href; internal clicks go through the app's router. */
export const useLink = (href: string | undefined) => {
  const { navigate, useHref = identity } = useContext(RouterContext);
  const resolved = useHref(href ?? '');
  const external = href !== undefined && EXTERNAL.test(href);

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    if (href === undefined || external || !navigate || event.defaultPrevented) return;
    // Modified and middle clicks belong to the browser: new tab or window.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    navigate(href);
  };

  return {
    href: href === undefined ? undefined : resolved,
    target: external ? ('_blank' as const) : undefined,
    rel: external ? 'noopener noreferrer' : undefined,
    onClick,
  };
};
