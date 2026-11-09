import type React from 'react';

import { Badge } from '@/components/atomic/Badge';
import { Tabs as TabsRoot, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export interface TabItem {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  /** Names the tab list. */
  'aria-label': string;
  size?: 'sm' | 'md';
  /** line: an underline on the active tab, for a row that sits on a border. */
  variant?: 'default' | 'line';
  'data-testid'?: string;
}

/** The tab row only: render the panel for `value` yourself. */
export const Tabs: React.FC<TabsProps> = props => {
  const {
    items,
    value,
    onChange,
    'aria-label': ariaLabel,
    size = 'md',
    variant = 'default',
    'data-testid': testId,
  } = props;
  const isLine = variant === 'line';

  return (
    <TabsRoot
      value={value}
      onValueChange={next => onChange(String(next))}
      data-testid={testId}
      className="min-w-0"
    >
      <TabsList
        aria-label={ariaLabel}
        variant={variant}
        className={cn(
          // relative: Base UI scrolls the focused tab using offsets from this element.
          // No visible scrollbar: a classic one would eat the fixed-height row.
          'supports-[animation-timeline:scroll()]:scroll-fade-x relative max-w-full [scrollbar-width:none] justify-start overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden',
          size === 'sm' && 'group-data-horizontal/tabs:h-7',
          isLine && 'p-0'
        )}
      >
        {items.map(item => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cn(
              'flex-none',
              size === 'sm' && 'text-xs',
              // The list clips overflow, so the primitive's underline below the tab would vanish.
              isLine &&
                'after:bg-brand h-full rounded-none group-data-horizontal/tabs:after:bottom-0'
            )}
          >
            {item.label}
            {item.count !== undefined && <Badge>{item.count}</Badge>}
          </TabsTrigger>
        ))}
      </TabsList>
    </TabsRoot>
  );
};
