import type React from 'react';

import { Toaster as Sonner } from 'sonner';

// Sonner's own colour variables pointed at our tokens, so dark mode follows the .dark class.
const TOKENS = {
  '--normal-bg': 'var(--popover)',
  '--normal-text': 'var(--popover-foreground)',
  '--normal-border': 'var(--border)',
  '--border-radius': 'var(--radius)',
} as React.CSSProperties;

/** Mount once at the app root. */
export const Toaster: React.FC = () => (
  <Sonner
    position="bottom-right"
    style={TOKENS}
    // sonner sets its own font, and its description grey ignores .dark (1.7:1 on the popover).
    toastOptions={{ classNames: { toast: 'font-sans', description: 'text-muted-foreground!' } }}
  />
);
