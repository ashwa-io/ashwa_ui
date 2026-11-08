import { useMemo } from 'react';
import type React from 'react';

import { Toaster } from '@/components/molecule/Toaster';

import { RouterContext } from './useLink';

export interface UIProviderProps {
  children: React.ReactNode;
  /** Client-side navigation from the app's router. Without it links navigate natively. */
  navigate?: (href: string) => void;
  /** Resolves an href for the anchor (base paths). A hook: it is called during render. */
  useHref?: (href: string) => string;
}

/** Mount once at the app root: connects the app's router and shows toasts. */
export const UIProvider: React.FC<UIProviderProps> = props => {
  const { children, navigate, useHref } = props;
  const router = useMemo(() => ({ navigate, useHref }), [navigate, useHref]);

  return (
    <RouterContext.Provider value={router}>
      {children}
      <Toaster />
    </RouterContext.Provider>
  );
};
