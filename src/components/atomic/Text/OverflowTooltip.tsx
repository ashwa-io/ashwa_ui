import type React from 'react';
import { useState } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type OpenChange = NonNullable<React.ComponentProps<typeof Tooltip>['onOpenChange']>;

interface OverflowTooltipProps {
  /** The truncating element, without id or children; it becomes the trigger itself. */
  element: React.ReactElement;
  children: React.ReactNode;
  id?: string;
}

/**
 * Shows the element's full text in a tooltip, only while it is cut off. Nothing is measured until
 * the tooltip is about to open, so a table of truncated cells costs no layout reads or DOM.
 * Internal: Text and Heading use it for `truncate`.
 */
export const OverflowTooltip: React.FC<OverflowTooltipProps> = props => {
  const { element, children, id } = props;
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  const onOpenChange: OpenChange = (next, details) => {
    if (!next) {
      setOpen(false);
      return;
    }
    // Hover and focus opens name the trigger, which is the element itself.
    const target = details.trigger;
    const fullText = target?.textContent?.trim() ?? '';
    if (!target || target.scrollWidth <= target.clientWidth || !fullText) {
      // The text fits: veto the open so the primitive stays idle, as if never hovered.
      details.cancel();
      return;
    }
    setText(fullText);
    setOpen(true);
  };

  return (
    <Tooltip open={open} onOpenChange={onOpenChange}>
      {/* delay={0} matches the public Tooltip's provider, without mounting a provider per text. */}
      <TooltipTrigger id={id} delay={0} render={element}>
        {children}
      </TooltipTrigger>
      {/* Long unbroken names (a VIN, a file name) wrap instead of spilling out of the popup. */}
      <TooltipContent className="wrap-anywhere">{text}</TooltipContent>
    </Tooltip>
  );
};
