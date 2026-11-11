import type React from 'react';

import { Badge } from '@/components/atomic/Badge';
import { Tabs as TabsRoot, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip as TooltipRoot,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { IconComponent } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface TabItem {
  value: string;
  label: string;
  icon?: IconComponent;
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
  /** Shows only each tab's icon; its label becomes the accessible name and a tooltip. */
  iconOnly?: boolean;
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
    iconOnly = false,
    'data-testid': testId,
  } = props;
  const isLine = variant === 'line';

  const tabs = (
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
          'supports-[animation-timeline:scroll()]:scroll-fade-x no-scrollbar relative max-w-full justify-start overflow-x-auto overflow-y-hidden',
          size === 'sm' && 'group-data-horizontal/tabs:h-7',
          isLine && 'p-0'
        )}
      >
        {items.map(item => {
          const Icon = item.icon;
          const triggerClass = cn(
            'flex-none',
            size === 'sm' && 'text-xs',
            // The list clips overflow, so the primitive's underline below the tab would vanish.
            isLine && 'after:bg-brand h-full rounded-none group-data-horizontal/tabs:after:bottom-0'
          );

          if (iconOnly && Icon) {
            // The tab is the tooltip's trigger itself: a wrapper would sit between the list and
            // its tabs and break keyboard movement between them.
            return (
              <TooltipRoot key={item.value}>
                <TooltipTrigger
                  render={
                    <TabsTrigger
                      value={item.value}
                      disabled={item.disabled}
                      aria-label={item.label}
                      className={triggerClass}
                    />
                  }
                >
                  <Icon aria-hidden />
                  {item.count !== undefined && <Badge>{item.count}</Badge>}
                </TooltipTrigger>
                <TooltipContent>{item.label}</TooltipContent>
              </TooltipRoot>
            );
          }

          return (
            <TabsTrigger
              key={item.value}
              value={item.value}
              disabled={item.disabled}
              className={triggerClass}
            >
              {Icon && <Icon aria-hidden />}
              {item.label}
              {item.count !== undefined && <Badge>{item.count}</Badge>}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </TabsRoot>
  );

  return iconOnly ? <TooltipProvider>{tabs}</TooltipProvider> : tabs;
};
