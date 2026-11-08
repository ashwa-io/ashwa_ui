import { useCallback, useState } from 'react';
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
  /** Body without padding, for lists and tables that run edge to edge. */
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

const FOCUSABLE =
  'a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])';

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
  const [needsTabStop, setNeedsTabStop] = useState(false);

  // A scrolling body with nothing focusable needs a tab stop for keyboard scrolling; anywhere
  // else a tab stop would take first focus from the form's first input.
  // shortcut: children swapped in after open aren't observed, observe a wrapper if that shows up.
  const bodyRef = useCallback((body: HTMLDivElement | null) => {
    if (!body) return undefined;
    const check = () =>
      setNeedsTabStop(body.scrollHeight > body.clientHeight && !body.querySelector(FOCUSABLE));
    const observer = new ResizeObserver(check);
    observer.observe(body);
    Array.from(body.children).forEach(child => observer.observe(child));
    return () => observer.disconnect();
  }, []);

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
          'flex max-h-[85dvh] flex-col [--surface:var(--popover)]',
          SIZE[size],
          fixedHeight && 'h-[min(40rem,85dvh)]'
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div
          ref={bodyRef}
          data-slot="modal-body"
          tabIndex={needsTabStop ? 0 : undefined}
          // The body clips (it scrolls), so non-flush bodies keep room for 3px focus rings.
          className={cn('min-h-0 flex-1 overflow-y-auto', flush ? '-m-4' : '-m-1 p-1')}
        >
          {children}
        </div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};
