import { useEffect, useState } from 'react';
import type React from 'react';

import { CheckIcon, CopyIcon } from 'lucide-react';

import { IconButton } from '@/components/atomic/IconButton';
import { useScrollTabStop } from '@/hooks/useScrollTabStop';
import { cn } from '@/lib/utils';

export interface CodeBlockProps {
  code: string;
  size?: 'sm' | 'md';
  /** Wraps long lines instead of scrolling. */
  wrap?: boolean;
  lineNumbers?: boolean;
  'data-testid'?: string;
}

const SIZE: Record<NonNullable<CodeBlockProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-sm',
};

export const CodeBlock: React.FC<CodeBlockProps> = props => {
  const { code, size = 'md', wrap = false, lineNumbers = false, 'data-testid': testId } = props;
  const [copied, setCopied] = useState(false);
  const tabStop = useScrollTabStop();
  const whitespace = wrap ? 'break-all whitespace-pre-wrap' : 'whitespace-pre';

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = () => {
    // Undefined on plain http, and writeText rejects when permission is denied.
    void navigator.clipboard?.writeText(code).then(
      () => setCopied(true),
      () => undefined
    );
  };

  return (
    // overflow-clip: the scroller reaches the rounded border, so its scrollbar sits on it.
    <div data-testid={testId} className="bg-muted/50 relative overflow-clip rounded-lg border">
      <pre
        ref={tabStop.ref}
        tabIndex={tabStop.tabIndex}
        className={cn('overflow-x-auto py-3 pr-11 pl-3 font-mono', SIZE[size])}
      >
        <code className="block w-fit min-w-full">
          {lineNumbers ? (
            code
              .replace(/\n$/, '')
              .split('\n')
              .map((line, index) => (
                <span key={index} className="flex">
                  <span
                    data-line-number
                    aria-hidden
                    className="text-muted-foreground w-8 shrink-0 pr-3 text-right select-none"
                  >
                    {index + 1}
                  </span>
                  <span className={whitespace}>{line || ' '}</span>
                </span>
              ))
          ) : (
            <span className={whitespace}>{code}</span>
          )}
        </code>
      </pre>
      <div className="absolute top-1.5 right-1.5">
        <IconButton
          icon={copied ? CheckIcon : CopyIcon}
          aria-label={copied ? 'Copied' : 'Copy code'}
          variant="ghost"
          size="sm"
          onClick={copy}
        />
      </div>
    </div>
  );
};
