import type React from 'react';

/** Shared size scale for every public component. */
export type Size = 'sm' | 'md' | 'lg';

/** An icon component (lucide-react, svgr): the design system controls its size and colour. */
export type IconComponent = React.ComponentType<{
  className?: string;
  'aria-hidden'?: boolean;
  'data-icon'?: string;
}>;
