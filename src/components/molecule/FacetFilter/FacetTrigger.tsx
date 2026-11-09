import type React from 'react';

import { ChevronDownIcon, PlusIcon } from 'lucide-react';

import { Button as ButtonPrimitive } from '@/components/ui/button';
import { PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type FacetSize = 'sm' | 'md';

export interface FacetTriggerProps {
  title: string;
  /** What is picked, in words, e.g. 'Truck' or 'Greater than 60'. Left out while nothing is. */
  summary?: string;
  active: boolean;
  /** Turns the plus into a × while active. Left out when the filter must hold a value. */
  onClear?: () => void;
  size?: FacetSize;
  disabled?: boolean;
  'data-testid'?: string;
}

/** Internal: the dashed filter button; must be rendered inside a popover root. */
export const FacetTrigger: React.FC<FacetTriggerProps> = props => {
  const {
    title,
    summary,
    active,
    onClear,
    size = 'sm',
    disabled = false,
    'data-testid': testId,
  } = props;
  const clearable = active && onClear !== undefined;

  return (
    <PopoverTrigger
      disabled={disabled}
      data-testid={testId}
      render={
        <ButtonPrimitive
          variant="outline"
          size={size === 'sm' ? 'sm' : 'default'}
          className={cn('font-normal', !active && 'border-dashed')}
        />
      }
    >
      {(!active || clearable) && (
        // A mouse shortcut, so hidden from assistive tech: the list's Clear filters is the keyboard path.
        <span
          aria-hidden
          className={cn(
            'inline-flex transition-transform duration-200',
            clearable && 'text-destructive rotate-45'
          )}
          onPointerDown={clearable ? event => event.stopPropagation() : undefined}
          onClick={
            clearable
              ? event => {
                  event.stopPropagation();
                  onClear?.();
                }
              : undefined
          }
        >
          <PlusIcon data-icon="inline-start" />
        </span>
      )}
      <span>{title}</span>
      {summary && (
        <>
          <span aria-hidden className="bg-border h-4 w-px" />
          <span className="text-brand-text max-w-40 truncate font-semibold">{summary}</span>
        </>
      )}
      <ChevronDownIcon data-icon="inline-end" aria-hidden className="ml-auto" />
    </PopoverTrigger>
  );
};
