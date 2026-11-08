import { useState } from 'react';
import type React from 'react';

import { CheckIcon } from 'lucide-react';

import { Button } from '@/components/atomic/Button';
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import type { IconComponent } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface FacetOption {
  value: string;
  label: string;
  icon?: IconComponent;
  /** Result count shown at the end of the row. */
  count?: number;
  disabled?: boolean;
}

export interface FacetListProps {
  /** Accessible name of the search box. */
  label: string;
  options: FacetOption[];
  value: string[];
  onChange: (value: string[]) => void;
  /** false: one choice; picking the selected option clears it. */
  multiple?: boolean;
  showSelectAll?: boolean;
  /** Shows "Clear filters" while anything is selected. */
  clearable?: boolean;
}

const CheckBox: React.FC<{ checked: boolean }> = props => (
  <span
    aria-hidden
    className={cn(
      'border-input flex size-4 shrink-0 items-center justify-center rounded-[4px] border',
      props.checked && 'border-primary bg-primary'
    )}
  >
    {props.checked && <CheckIcon className="text-primary-foreground! size-3.5" />}
  </span>
);

/** Internal: search box + arrow-key list, shared by the facet filters and FilterMenu. */
export const FacetList: React.FC<FacetListProps> = props => {
  const {
    label,
    options,
    value,
    onChange,
    multiple = true,
    showSelectAll = false,
    clearable = true,
  } = props;
  const [query, setQuery] = useState('');
  const byValue = new Map(options.map(option => [option.value, option]));
  const enabled = options.filter(option => !option.disabled).map(option => option.value);
  const allSelected = enabled.length > 0 && enabled.every(item => value.includes(item));

  // The list always runs in multiple mode so picking the selected option can clear it.
  const handleChange = (next: string[]) => {
    if (multiple) {
      onChange(next);
      return;
    }
    onChange(next.filter(item => !value.includes(item)).slice(-1));
  };

  return (
    <Combobox
      inline
      open
      multiple
      items={options.map(option => option.value)}
      itemToStringLabel={(item: string) => byValue.get(item)?.label ?? item}
      value={value}
      onValueChange={handleChange}
      inputValue={query}
      onInputValueChange={setQuery}
    >
      <div className="border-b p-1">
        <ComboboxInput showTrigger={false} placeholder="Search" aria-label={label} />
      </div>
      {showSelectAll && query === '' && (
        <div className="px-1 pt-1">
          <button
            type="button"
            aria-pressed={allSelected}
            onClick={() => onChange(allSelected ? [] : enabled)}
            className="hover:bg-accent hover:text-accent-foreground flex w-full cursor-default items-center gap-2 rounded-md py-1 pl-1.5 text-sm font-medium outline-none"
          >
            <CheckBox checked={allSelected} />
            Select all
          </button>
        </div>
      )}
      <ComboboxEmpty className="flex empty:hidden">No results</ComboboxEmpty>
      <ComboboxList className="max-h-60" aria-multiselectable={multiple}>
        {(item: string) => {
          const option = byValue.get(item);
          if (!option) return null;
          const Icon = option.icon;
          const selected = value.includes(item);
          return (
            <ComboboxItem
              key={item}
              value={item}
              disabled={option.disabled}
              className={cn(
                selected && 'bg-brand-tint text-brand-tint-foreground',
                // The primitive's trailing check is replaced by a leading checkbox in multi mode.
                multiple && 'pr-1.5 [&>.absolute]:hidden'
              )}
            >
              {multiple && <CheckBox checked={selected} />}
              {Icon && <Icon aria-hidden />}
              <span className="min-w-0 flex-1 truncate">{option.label}</span>
              {option.count !== undefined && (
                <span className={cn('text-xs tabular-nums', !selected && 'text-muted-foreground')}>
                  {option.count}
                </span>
              )}
            </ComboboxItem>
          );
        }}
      </ComboboxList>
      {clearable && value.length > 0 && (
        <div className="border-t p-1">
          <Button variant="ghost" size="sm" fullWidth onClick={() => onChange([])}>
            Clear filters
          </Button>
        </div>
      )}
    </Combobox>
  );
};
