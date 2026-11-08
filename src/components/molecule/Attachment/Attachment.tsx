import type React from 'react';

import { CircleAlertIcon, FileIcon, RotateCwIcon, XIcon } from 'lucide-react';

import { Progress } from '@/components/atomic/Progress';
import {
  Attachment as AttachmentPrimitive,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup as AttachmentGroupPrimitive,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from '@/components/ui/attachment';
import { Spinner } from '@/components/ui/spinner';
import { useScrollTabStop } from '@/hooks/useScrollTabStop';
import type { IconComponent } from '@/lib/types';

export type AttachmentState = 'idle' | 'uploading' | 'processing' | 'error' | 'done';

export interface AttachmentProps {
  name: string;
  /** Size, status or the error message. */
  description?: string;
  state?: AttachmentState;
  /** 0-100 while uploading; omit for an indeterminate bar. */
  progress?: number;
  icon?: IconComponent;
  /** Shows a thumbnail instead of the icon. */
  imageSrc?: string;
  size?: 'xs' | 'sm' | 'md';
  orientation?: 'horizontal' | 'vertical';
  /** Makes the whole tile open the file. */
  onOpen?: () => void;
  onRemove?: () => void;
  /** Shown only in the error state. */
  onRetry?: () => void;
  'data-testid'?: string;
}

export interface AttachmentGroupProps {
  children: React.ReactNode;
  'data-testid'?: string;
}

const SIZE = { xs: 'xs', sm: 'sm', md: 'default' } as const;

export const Attachment: React.FC<AttachmentProps> = props => {
  const {
    name,
    description,
    state = 'done',
    progress,
    icon = FileIcon,
    imageSrc,
    size = 'md',
    orientation = 'horizontal',
    onOpen,
    onRemove,
    onRetry,
    'data-testid': testId,
  } = props;
  const Icon = state === 'error' ? CircleAlertIcon : icon;
  const canRetry = state === 'error' && onRetry;

  return (
    <AttachmentPrimitive
      state={state}
      size={SIZE[size]}
      orientation={orientation}
      data-testid={testId}
    >
      {imageSrc ? (
        <AttachmentMedia variant="image">
          <img src={imageSrc} alt="" />
        </AttachmentMedia>
      ) : (
        <AttachmentMedia>
          {state === 'uploading' || state === 'processing' ? <Spinner /> : <Icon aria-hidden />}
        </AttachmentMedia>
      )}
      <AttachmentContent>
        <AttachmentTitle>{name}</AttachmentTitle>
        {description && <AttachmentDescription>{description}</AttachmentDescription>}
        {state === 'uploading' && (
          <div className="mt-1.5">
            <Progress label={`Uploading ${name}`} hideLabel value={progress} />
          </div>
        )}
      </AttachmentContent>
      {(canRetry || onRemove) && (
        <AttachmentActions>
          {canRetry && (
            <AttachmentAction aria-label={`Retry ${name}`} onClick={onRetry}>
              <RotateCwIcon aria-hidden />
            </AttachmentAction>
          )}
          {onRemove && (
            <AttachmentAction aria-label={`Remove ${name}`} onClick={onRemove}>
              <XIcon aria-hidden />
            </AttachmentAction>
          )}
        </AttachmentActions>
      )}
      {onOpen && <AttachmentTrigger aria-label={`Open ${name}`} onClick={onOpen} />}
    </AttachmentPrimitive>
  );
};

export const AttachmentGroup: React.FC<AttachmentGroupProps> = props => {
  const { children, 'data-testid': testId } = props;
  const tabStop = useScrollTabStop();

  return (
    <AttachmentGroupPrimitive ref={tabStop.ref} tabIndex={tabStop.tabIndex} data-testid={testId}>
      {children}
    </AttachmentGroupPrimitive>
  );
};
