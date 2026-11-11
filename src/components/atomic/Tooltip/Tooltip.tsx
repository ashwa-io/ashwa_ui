import type React from 'react';

import {
  Tooltip as TooltipRoot,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { OverlaySide } from '@/lib/types';

export interface TooltipProps {
  /**
   * Short plain text, a visual hint only: screen readers don't get it, and it needs a focusable
   * child to appear for keyboards. Never put essential information only here. Cut-off text needs
   * no Tooltip: `Text` and `Heading` with `truncate` show their full text themselves.
   */
  content: string;
  children: React.ReactNode;
  side?: OverlaySide;
  /** Lets a full-width child (e.g. `<Button fullWidth>`) fill its container. */
  fullWidth?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = props => {
  const { content, children, side = 'top', fullWidth = false } = props;

  return (
    <TooltipProvider>
      <TooltipRoot>
        {/* Public components ignore unknown props, so the trigger is a wrapper span; focus from a
            focusable child bubbles to it, so keyboard users see the tooltip too. */}
        <TooltipTrigger
          render={<span className={fullWidth ? 'flex w-full' : 'inline-flex max-w-full min-w-0'} />}
        >
          {children}
        </TooltipTrigger>
        <TooltipContent side={side}>{content}</TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
};
