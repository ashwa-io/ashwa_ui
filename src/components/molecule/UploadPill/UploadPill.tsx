import { useState } from 'react';

import { CheckIcon, ChevronDownIcon, ChevronUpIcon, CircleAlertIcon } from 'lucide-react';

import { Text } from '@/components/atomic/Text';
import { Attachment } from '@/components/molecule/Attachment';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export type UploadPillState = 'processing' | 'uploading' | 'error' | 'done';

export interface UploadPillItem {
  id: string;
  name: string;
  /** `processing` is the wait before bytes move: checking, shrinking, signing. */
  state: UploadPillState;
  /** 0-100 while uploading. */
  progress?: number;
  /** Replaces the line under the name, such as the reason a file failed. */
  description?: string;
  /** Thumbnail of an image. */
  imageSrc?: string;
}

export interface UploadPillProps {
  /** Every upload to show. With none, nothing is drawn. */
  items: UploadPillItem[];
  /** Stops an upload that is still running. */
  onCancel: (id: string) => void;
  onRetry: (id: string) => void;
  /** Takes a finished or failed file off the list. */
  onRemove: (id: string) => void;
  'data-testid'?: string;
}

const FULL = 100;

const isActive = (item: UploadPillItem): boolean =>
  item.state === 'processing' || item.state === 'uploading';

const describe = (item: UploadPillItem): string => {
  if (item.description) return item.description;
  if (item.state === 'processing') return 'Preparing…';
  if (item.state === 'uploading') return `Uploading ${Math.round(item.progress ?? 0)}%`;
  return item.state === 'error' ? 'Upload failed' : 'Attached';
};

const countFiles = (count: number): string => `${count} ${count === 1 ? 'file' : 'files'}`;

/**
 * Uploads in progress, as a pill at the foot of the window that opens into
 * the list. It stays out of the way while files move and says so when one
 * fails. Mount it once for the whole app.
 */
export const UploadPill: React.FC<UploadPillProps> = props => {
  const { items, onCancel, onRetry, onRemove, 'data-testid': testId } = props;
  const [isOpenByUser, setIsOpenByUser] = useState(false);

  if (items.length === 0) return null;

  const active = items.filter(isActive);
  const failedCount = items.filter(item => item.state === 'error').length;
  const settledCount = items.length - active.length;
  const isUploading = active.length > 0;
  // A failure the user has not seen must not hide behind a closed pill.
  const isOpen = isOpenByUser || failedCount > 0;

  // Failed files are left out: they are not on their way anywhere.
  const moving = items.filter(item => item.state !== 'error');
  const percent =
    moving.length === 0
      ? 0
      : Math.round(
          moving.reduce(
            (sum, item) => sum + (item.state === 'done' ? FULL : (item.progress ?? 0)),
            0
          ) / moving.length
        );

  let title = `${countFiles(items.length)} attached`;
  if (isUploading) {
    title = `Uploading ${Math.min(settledCount + 1, items.length)} of ${items.length}`;
  } else if (failedCount > 0) {
    title = `${countFiles(failedCount)} failed`;
  }

  const Chevron = isOpen ? ChevronDownIcon : ChevronUpIcon;
  const statusIcon = (
    <>
      {isUploading && <Spinner />}
      {!isUploading && failedCount > 0 && (
        <CircleAlertIcon aria-hidden className="text-destructive size-5" />
      )}
      {!isUploading && failedCount === 0 && (
        <span className="bg-success flex size-5 items-center justify-center rounded-full">
          <CheckIcon aria-hidden className="text-background size-3.5" strokeWidth={3} />
        </span>
      )}
    </>
  );

  return (
    // The strip spans the window to centre the pill but must not eat clicks meant for the page.
    <div
      data-testid={testId}
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
    >
      <div
        className={cn(
          'bg-background pointer-events-auto border shadow-lg',
          isOpen ? 'w-full max-w-md overflow-hidden rounded-2xl' : 'rounded-full'
        )}
      >
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpenByUser(!isOpen)}
          className={cn(
            'focus-visible:ring-ring/50 flex min-h-11 w-full items-center gap-3 px-4 py-2 text-left outline-none focus-visible:ring-3',
            isOpen ? 'border-b' : 'rounded-full'
          )}
        >
          {statusIcon}
          <span className="flex min-w-0 flex-1 items-baseline gap-2" aria-live="polite">
            <Text as="span" size="sm" weight="medium">
              {title}
            </Text>
            {isUploading && (
              <Text as="span" size="sm" tone="muted">
                {`${percent}%`}
              </Text>
            )}
            {isUploading && failedCount > 0 && (
              <Text as="span" size="xs" tone="danger">
                {`${failedCount} failed`}
              </Text>
            )}
          </span>
          <Chevron aria-hidden className="text-muted-foreground size-4 shrink-0" />
        </button>
        {isOpen && (
          <ul aria-label="Uploads" className="flex max-h-72 flex-col gap-1 overflow-y-auto p-2">
            {items.map(item => (
              <li key={item.id}>
                <Attachment
                  fullWidth
                  size="sm"
                  name={item.name}
                  description={describe(item)}
                  state={item.state}
                  progress={item.progress}
                  imageSrc={item.imageSrc}
                  onRetry={() => onRetry(item.id)}
                  // The same X stops a running upload and clears a finished one.
                  onRemove={() => (isActive(item) ? onCancel(item.id) : onRemove(item.id))}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
