import type React from 'react';

import { Text } from '@/components/atomic/Text';
import { cn } from '@/lib/utils';

export interface ListProps {
  children: React.ReactNode;
  density?: 'default' | 'compact';
  'aria-label'?: string;
  'data-testid'?: string;
}

export const List: React.FC<ListProps> = props => {
  const { children, density = 'default', 'aria-label': ariaLabel, 'data-testid': testId } = props;

  return (
    <ul
      aria-label={ariaLabel}
      data-testid={testId}
      className={cn('flex flex-col', density === 'default' && 'gap-1')}
    >
      {children}
    </ul>
  );
};

export interface ListItemProps {
  label: string;
  description?: string;
  /** Makes the row a button; start and end content must then not be interactive. */
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  size?: 'sm' | 'md';
  id?: string;
  'data-testid'?: string;
}

export const ListItem: React.FC<ListItemProps> = props => {
  const {
    label,
    description,
    onClick,
    selected = false,
    disabled = false,
    startContent,
    endContent,
    size = 'md',
    id,
    'data-testid': testId,
  } = props;
  const row = cn(
    'flex w-full items-center gap-3 rounded-md px-2 text-left text-sm',
    size === 'sm' ? 'py-1' : 'py-2',
    selected && 'bg-secondary text-secondary-foreground'
  );
  const content = (
    <>
      {startContent}
      <span className="flex min-w-0 flex-1 flex-col">
        <Text as="span" truncate>
          {label}
        </Text>
        {description && (
          <Text as="span" size="xs" tone={selected ? undefined : 'muted'} truncate>
            {description}
          </Text>
        )}
      </span>
      {endContent}
    </>
  );

  return (
    <li id={id} data-testid={testId}>
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-current={selected || undefined}
          className={cn(
            row,
            'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 focus-visible:outline-ring focus-visible:ring-3 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50'
          )}
        >
          {content}
        </button>
      ) : (
        <div aria-current={selected || undefined} className={row}>
          {content}
        </div>
      )}
    </li>
  );
};
