import type React from 'react';

import {
  HoverCard as HoverCardRoot,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import type { OverlaySide } from '@/lib/types';

export interface HoverCardProps {
  /** Extra detail only: touch screens have no hover, so never put essentials here. */
  content: React.ReactNode;
  /** Must be focusable, e.g. a link or button, so keyboards can open it. */
  children: React.ReactNode;
  side?: OverlaySide;
}

export const HoverCard: React.FC<HoverCardProps> = props => {
  const { content, children, side = 'bottom' } = props;

  return (
    <HoverCardRoot>
      {/* Public components ignore unknown props, so the trigger is a wrapper span. */}
      <HoverCardTrigger render={<span className="inline-flex max-w-full min-w-0" />}>
        {children}
      </HoverCardTrigger>
      <HoverCardContent side={side}>{content}</HoverCardContent>
    </HoverCardRoot>
  );
};
