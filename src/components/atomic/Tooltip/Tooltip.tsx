import type React from 'react';

import {
  Tooltip as TooltipRoot,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { OverlaySide } from '@/lib/types';

export interface TooltipProps {
  /** Short plain text; tooltips never hold interactive content. */
  content: string;
  children: React.ReactNode;
  side?: OverlaySide;
}

export const Tooltip: React.FC<TooltipProps> = props => {
  const { content, children, side = 'top' } = props;

  return (
    <TooltipProvider>
      <TooltipRoot>
        {/* Public components ignore unknown props, so the trigger is a wrapper span; focus from a
            focusable child bubbles to it, so keyboard users see the tooltip too. */}
        <TooltipTrigger render={<span className="inline-flex" />}>{children}</TooltipTrigger>
        <TooltipContent side={side}>{content}</TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
};
