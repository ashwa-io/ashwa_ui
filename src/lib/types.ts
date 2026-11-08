import type React from 'react';

/** Shared size scale for every public component. */
export type Size = 'sm' | 'md' | 'lg';

export type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

/** Which side of the trigger an overlay opens on. */
export type OverlaySide = 'top' | 'bottom' | 'left' | 'right';

/** How an overlay lines up with its trigger along that side. */
export type OverlayAlign = 'start' | 'center' | 'end';

/** An icon component (lucide-react, svgr): the design system controls its size and colour. */
export type IconComponent = React.ComponentType<{
  className?: string;
  'aria-hidden'?: boolean;
  'data-icon'?: string;
}>;

/** Label, help and error props every form input shares (rendered by FormField). */
export interface FieldBaseProps {
  /** Accessible name; always required, even when hidden. */
  label: string;
  /** Hides the label visually; screen readers still announce it. */
  hideLabel?: boolean;
  description?: string;
  /** Message shown under the field; also sets aria-invalid. */
  error?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  'data-testid'?: string;
}
