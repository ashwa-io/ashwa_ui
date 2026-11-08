import type React from 'react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useScrollTabStop } from '@/hooks/useScrollTabStop';
import { cn } from '@/lib/utils';

export type DrawerSize = 'sm' | 'md' | 'lg';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  /** Names the dialog (required). */
  title: string;
  description?: string;
  children: React.ReactNode;
  /** e.g. Cancel + Save buttons. */
  footer?: React.ReactNode;
  side?: 'left' | 'right';
  size?: DrawerSize;
  /** Body without padding, for lists and tables that run edge to edge. */
  flush?: boolean;
  'data-testid'?: string;
}

const SIZE: Record<DrawerSize, string> = {
  sm: 'data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm',
  md: 'data-[side=left]:sm:max-w-md data-[side=right]:sm:max-w-md',
  lg: 'data-[side=left]:sm:max-w-xl data-[side=right]:sm:max-w-xl',
};

export const Drawer: React.FC<DrawerProps> = props => {
  const {
    open,
    onClose,
    title,
    description,
    children,
    footer,
    side = 'right',
    size = 'md',
    flush = false,
    'data-testid': testId,
  } = props;
  const tabStop = useScrollTabStop();

  return (
    <Sheet
      open={open}
      onOpenChange={next => {
        if (!next) onClose();
      }}
    >
      <SheetContent
        side={side}
        data-testid={testId}
        className={cn('gap-0 [--surface:var(--popover)]', SIZE[size])}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div
          ref={tabStop.ref}
          tabIndex={tabStop.tabIndex}
          data-slot="drawer-body"
          // Runs to the panel's edge so the scrollbar sits on it; the padding moves inside.
          // The @supports guard: without scroll timelines the fade would sit over the first line.
          className={cn(
            'min-h-0 flex-1 overflow-y-auto',
            !flush && 'supports-[animation-timeline:scroll()]:scroll-fade-y px-4 pb-4'
          )}
        >
          {children}
        </div>
        {footer && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
};
