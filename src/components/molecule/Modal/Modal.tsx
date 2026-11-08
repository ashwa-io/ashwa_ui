import type React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  /** Body without side padding, for lists and tables that run edge to edge. */
  flush?: boolean;
  /** false: no close button; Escape and outside clicks do nothing (blocking flows). */
  closable?: boolean;
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
    'data-testid': testId,
  } = props;

  return (
    <Dialog
      open={open}
      onOpenChange={next => {
        if (!next && closable) onClose();
      }}
    >
      <DialogContent
        showCloseButton={closable}
        data-testid={testId}
        className={cn(
          'flex max-h-[85dvh] flex-col',
          SIZE[size],
          fixedHeight && 'h-[min(40rem,85dvh)]'
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div
          data-slot="modal-body"
          // shortcut: only fixed-height bodies are tabbable (a tabbable body would take first focus
          // from a form's first input), so long text-only modals need fixedHeight for keyboard scroll.
          tabIndex={fixedHeight ? 0 : undefined}
          className={cn('min-h-0 flex-1 overflow-y-auto', flush && '-mx-4')}
        >
          {children}
        </div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};
