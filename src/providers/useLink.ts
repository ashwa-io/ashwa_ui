import { createContext, useContext } from 'react';
import type React from 'react';

import { classifyHref } from './classifyHref';

export interface RouterAdapter {
  navigate?: (href: string) => void;
  useHref?: (href: string) => string;
}

export const RouterContext = createContext<RouterAdapter>({});

const identity = (href: string) => href;

// These hand off to another app, so a new tab would be left blank.
const HANDS_OFF = /^\s*(mailto|tel):/i;

/** Anchor props for an internal or external href; internal clicks go through the app's router. */
export const useLink = (href: string | undefined) => {
  const { navigate, useHref = identity } = useContext(RouterContext);
  const kind = href === undefined ? undefined : classifyHref(href);
  const route = kind === 'internal' ? href : undefined;
  const external = kind === 'external' ? href : undefined;
  // useHref resolves the app's routes: it would mangle https: and mailto: URLs.
  const resolved = useHref(route ?? '');
  const newTab = external !== undefined && !HANDS_OFF.test(external);

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    // Only hrefs the browser reads as same-origin may reach the app's router.
    if (route === undefined || !navigate || event.defaultPrevented) return;
    // Modified and middle clicks belong to the browser: new tab or window.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    navigate(route);
  };

  return {
    href: route === undefined ? external : resolved,
    target: newTab ? ('_blank' as const) : undefined,
    rel: newTab ? 'noopener noreferrer' : undefined,
    onClick,
  };
};
