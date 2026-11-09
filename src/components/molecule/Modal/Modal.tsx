import type React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useScrollTabStop } from '@/hooks/useScrollTabStop';
import { cn } from '@/lib/utils';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Names the dialog (required). */
  title: string;
  description?: string;
  /** Body. */
  children: React.ReactNode;
  /** e.g. Cancel + Save buttons, right-aligned. */
  footer?: React.ReactNode;
  size?: ModalSize;
  /** Fixed height (min(40rem, 85dvh)): the body scrolls, header and footer stay put. */
  fixedHeight?: boolean;
  /** Body without padding, for lists and tables that run edge to edge. */
  flush?: boolean;
  /** false: no close button; Escape and outside clicks do nothing (blocking flows). */
  closable?: boolean;
  /** false: a click outside does not close it, for forms that would lose their input. */
  dismissOnBackdrop?: boolean;
  /** Beside the title, e.g. an Edit button. */
  headerActions?: React.ReactNode;
  'data-testid'?: string;
}

// ashwa_web's modal widths: 448, 512, 576, 672, 768 px.
const SIZE: Record<ModalSize, string> = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-xl',
  xl: 'sm:max-w-2xl',
  '2xl': 'sm:max-w-3xl',
};

export const Modal: React.FC<ModalProps> = props => {
  const {
    open,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md',
    fixedHeight = false,
    flush = false,
    closable = true,
    dismissOnBackdrop = true,
    headerActions,
    'data-testid': testId,
  } = props;
  const tabStop = useScrollTabStop();

  return (
    <Dialog
      open={open}
      disablePointerDismissal={!dismissOnBackdrop}
      onOpenChange={next => {
        if (!next && closable) onClose();
      }}
    >
      <DialogContent
        showCloseButton={closable}
        data-testid={testId}
        className={cn(
          // overflow-clip: a flush body reaches the rounded corners.
          'surface-popover flex max-h-[85dvh] flex-col overflow-clip',
          SIZE[size],
          fixedHeight && 'h-[min(40rem,85dvh)]'
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {headerActions && (
          <div
            className={cn(
              'absolute top-2 flex items-center gap-1',
              closable ? 'right-10' : 'right-2'
            )}
          >
            {headerActions}
          </div>
        )}
        <div
          ref={tabStop.ref}
          data-slot="modal-body"
          tabIndex={tabStop.tabIndex}
          // Runs to the dialog's edge so the scrollbar sits on the border; the padding moves inside.
          // py-1 keeps room for 3px focus rings, which this clipping element would cut.
          // The @supports guard: without scroll timelines the fade would sit over the first line.
          // Not when flush: a fade would wash out a table's sticky header.
          className={cn(
            'min-h-0 flex-1 overflow-y-auto',
            flush
              ? '-m-4'
              : 'supports-[animation-timeline:scroll()]:scroll-fade-y -mx-4 -my-1 px-4 py-1'
          )}
        >
          {children}
        </div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};
