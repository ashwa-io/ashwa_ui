import { useEffect, useId, useRef, useState } from 'react';

import { CameraIcon, UploadIcon } from 'lucide-react';

import { Button } from '@/components/atomic/Button';
import { Text } from '@/components/atomic/Text';
import { cn } from '@/lib/utils';

export interface FileDropzoneProps {
  /** Every file dropped, picked, pasted or photographed. Checking them is the caller's job. */
  onFiles: (files: File[]) => void;
  /** The line that asks for files. */
  title?: string;
  /** What is accepted, in words, such as "JPG, PNG, WebP or PDF". */
  hint?: string;
  /** The file input's `accept`. A drop or a paste is not held to it. */
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  /** Adds "Take photo", which opens the camera on a phone. */
  camera?: boolean;
  /** Takes files pasted anywhere on the page, such as a screenshot. Keep it to one dropzone on screen. */
  paste?: boolean;
  id?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

const DEFAULT_TITLE = 'Drop files here';
const PASTE_TITLE = 'Drop files here, or paste a screenshot';

export const FileDropzone: React.FC<FileDropzoneProps> = props => {
  const { onFiles, hint, accept, multiple = false, disabled = false } = props;
  const { camera = false, paste = false, id, 'data-testid': testId } = props;
  const { title = paste ? PASTE_TITLE : DEFAULT_TITLE, 'aria-label': ariaLabel = 'Files' } = props;

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const hintId = useId();

  const take = (files: Iterable<File> | ArrayLike<File> | null | undefined) => {
    const list = Array.from(files ?? []);
    if (disabled || list.length === 0) return;
    onFiles(multiple ? list : list.slice(0, 1));
  };

  // Kept in a ref so the page listener is attached once, not on every render of the parent.
  const takeRef = useRef(take);
  takeRef.current = take;
  useEffect(() => {
    if (!paste || disabled) return undefined;
    // Pasting text carries no files, so typing into a field is never taken over.
    const handlePaste = (event: ClipboardEvent) => takeRef.current(event.clipboardData?.files);
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [paste, disabled]);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled) setIsDragOver(true);
  };
  const handleDragLeave = (event: React.DragEvent) => {
    // Moving onto the area's own children also fires dragleave.
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    setIsDragOver(false);
  };
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    take(event.dataTransfer.files);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    take(event.target.files);
    // The same file picked twice must fire again.
    event.target.value = '';
  };

  return (
    <div
      id={id}
      role="group"
      aria-label={ariaLabel}
      aria-describedby={hint ? hintId : undefined}
      data-testid={testId}
      onDragEnter={handleDragOver}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col items-center gap-3 rounded-xl border border-dashed p-6 text-center transition-colors',
        isDragOver ? 'border-brand bg-brand-tint' : 'border-input bg-muted/40',
        disabled && 'opacity-60'
      )}
    >
      <UploadIcon aria-hidden className="text-muted-foreground size-6" />
      <div className="flex flex-col gap-0.5">
        <Text as="span" size="sm" weight="medium">
          {title}
        </Text>
        {hint && (
          <Text as="span" size="xs" tone="muted" id={hintId}>
            {hint}
          </Text>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="primary" disabled={disabled} onClick={() => fileInput.current?.click()}>
          {multiple ? 'Choose files' : 'Choose file'}
        </Button>
        {camera && (
          <Button
            variant="outline"
            icon={CameraIcon}
            disabled={disabled}
            onClick={() => cameraInput.current?.click()}
          >
            Take photo
          </Button>
        )}
      </div>
      {/* Reached through the buttons above, so the inputs themselves stay out of the tab order and the reading order. */}
      <input
        ref={fileInput}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
        onChange={handleChange}
        data-testid={testId ? `${testId}-input` : undefined}
      />
      {camera && (
        <input
          ref={cameraInput}
          type="file"
          accept="image/*"
          capture="environment"
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
          className="hidden"
          onChange={handleChange}
        />
      )}
    </div>
  );
};
