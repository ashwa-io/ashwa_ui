import type React from 'react';

import { ChevronDownIcon } from 'lucide-react';

import { Button as ButtonPrimitive } from '@/components/ui/button';
import { PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type FacetSize = 'sm' | 'md';

export interface FacetTriggerProps {
  title: string;
  /** 'All', a count, an option label or a condition such as 'Greater than 60'. */
  summary: string;
  active: boolean;
  size?: FacetSize;
  disabled?: boolean;
  'data-testid'?: string;
}

/** Internal: the ghost filter button; must be rendered inside a popover root. */
export const FacetTrigger: React.FC<FacetTriggerProps> = props => {
  const { title, summary, active, size = 'sm', disabled = false, 'data-testid': testId } = props;

  return (
    <PopoverTrigger
      disabled={disabled}
      data-testid={testId}
      render={
        <ButtonPrimitive
          variant="ghost"
          size={size === 'sm' ? 'sm' : 'default'}
          className="font-normal"
        />
      }
    >
      <span>{title}</span>
      <span aria-hidden className="bg-border h-4 w-px" />
      <span
        className={cn(
          'max-w-40 truncate font-medium',
          active && 'bg-secondary text-secondary-foreground rounded-sm px-1'
        )}
      >
        {summary}
      </span>
      <ChevronDownIcon data-icon="inline-end" aria-hidden />
    </PopoverTrigger>
  );
};
