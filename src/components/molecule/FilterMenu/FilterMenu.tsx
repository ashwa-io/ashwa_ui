import { useState } from 'react';
import type React from 'react';

import { ChevronRightIcon, FilterIcon } from 'lucide-react';

import { Badge } from '@/components/atomic/Badge';
import { Button, type ButtonVariant } from '@/components/atomic/Button';
import { buttonLook } from '@/components/atomic/Button/buttonLook';
import { FacetList, type FacetOption } from '@/components/molecule/FacetFilter/FacetList';
import { Button as ButtonPrimitive } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Size } from '@/lib/types';

export interface FilterCategory {
  id: string;
  label: string;
  options: FacetOption[];
  /** false: one choice in this category. */
  multiple?: boolean;
}

/** Selected option values by category id. */
export type FilterMenuValue = Record<string, string[]>;

export interface FilterMenuProps {
  categories: FilterCategory[];
  value: FilterMenuValue;
  /** Always the whole object; keys that aren't categories are kept. */
  onChange: (value: FilterMenuValue) => void;
  label?: string;
  size?: Size;
  variant?: ButtonVariant;
  disabled?: boolean;
  'data-testid'?: string;
}

export const FilterMenu: React.FC<FilterMenuProps> = props => {
  const {
    categories,
    value,
    onChange,
    label = 'Filter',
    size = 'sm',
    variant = 'outline',
    disabled = false,
    'data-testid': testId,
  } = props;
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const selectedCount = (category: FilterCategory) =>
    category.options.filter(option => value[category.id]?.includes(option.value)).length;
  const activeCount = categories.filter(category => selectedCount(category) > 0).length;
  const look = buttonLook(variant, size, false);
  const needle = query.trim().toLowerCase();
  const visible = categories.filter(category => category.label.toLowerCase().includes(needle));

  const clearAll = () =>
    onChange({ ...value, ...Object.fromEntries(categories.map(({ id }) => [id, []])) });

  return (
    <Popover
      onOpenChange={open => {
        if (open) return;
        setQuery('');
        setOpenId(null);
      }}
    >
      <PopoverTrigger
        disabled={disabled}
        data-testid={testId}
        render={<ButtonPrimitive variant={look.variant} size={look.size} />}
      >
        <FilterIcon data-icon="inline-start" aria-hidden />
        {label}{' '}
        {activeCount > 0 && (
          <>
            <Badge tone="brand">{activeCount}</Badge>
            <span className="sr-only"> active</span>
          </>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" aria-label={label} className="w-60 gap-0 p-0">
        <div className="border-b p-1">
          <Input
            aria-label="Search filters"
            placeholder="Search"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
        </div>
        <div className="max-h-60 overflow-y-auto p-1">
          {visible.length === 0 && (
            <p className="text-muted-foreground py-2 text-center text-sm">No results</p>
          )}
          {visible.map(category => {
            const count = selectedCount(category);
            const multiple = category.multiple !== false;
            return (
              <Popover
                key={category.id}
                open={openId === category.id}
                onOpenChange={open => setOpenId(open ? category.id : null)}
              >
                <PopoverTrigger
                  render={
                    <button
                      type="button"
                      className="hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent data-popup-open:bg-accent data-popup-open:text-accent-foreground flex w-full cursor-default items-center gap-2 rounded-md px-1.5 py-1 text-sm outline-none"
                    />
                  }
                >
                  <span className="min-w-0 flex-1 truncate text-left">{category.label}</span>
                  {count > 0 && <span className="text-xs tabular-nums">{count}</span>}
                  <ChevronRightIcon aria-hidden className="size-4 shrink-0" />
                </PopoverTrigger>
                <PopoverContent
                  side="right"
                  align="start"
                  aria-label={category.label}
                  className="w-60 gap-0 p-0"
                >
                  <FacetList
                    label={category.label}
                    options={category.options}
                    value={value[category.id] ?? []}
                    onChange={next => onChange({ ...value, [category.id]: next })}
                    multiple={multiple}
                    showSelectAll={multiple}
                  />
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
        {activeCount > 0 && (
          <div className="border-t p-1">
            <Button variant="ghost" size="sm" fullWidth onClick={clearAll}>
              Clear all
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
