import type React from 'react';

import { Button } from '@/components/atomic/Button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export interface ConfirmDialogProps {
  open: boolean;
  /** Cancel and Escape. */
  onClose: () => void;
  /** Never closes the dialog: the app closes it when its work finishes. */
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  /** Confirm shows busy, Cancel is disabled and Escape is ignored. */
  loading?: boolean;
  'data-testid'?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = props => {
  const {
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel,
    cancelLabel = 'Cancel',
    destructive = false,
    loading = false,
    'data-testid': testId,
  } = props;

  return (
    <AlertDialog
      open={open}
      onOpenChange={next => {
        if (!next && !loading) onClose();
      }}
    >
      <AlertDialogContent data-testid={testId}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" disabled={loading} onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'primary'}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
