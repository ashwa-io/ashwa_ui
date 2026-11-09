import { useState } from 'react';
import type React from 'react';

import { FacetList, type FacetOption } from '@/components/molecule/FacetFilter/FacetList';
import { FacetTrigger, type FacetSize } from '@/components/molecule/FacetFilter/FacetTrigger';
import { Popover, PopoverContent } from '@/components/ui/popover';

export interface FacetFilterSelectProps {
  title: string;
  options: FacetOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  /** Always holds a value: no clear option, and onChange never gets null. */
  required?: boolean;
  size?: FacetSize;
  disabled?: boolean;
  'data-testid'?: string;
}

export const FacetFilterSelect: React.FC<FacetFilterSelectProps> = props => {
  const {
    title,
    options,
    value,
    onChange,
    required = false,
    size,
    disabled,
    'data-testid': testId,
  } = props;
  const [open, setOpen] = useState(false);
  const selected = options.find(option => option.value === value);

  const handleChange = (next: string[]) => {
    setOpen(false);
    if (next.length > 0) onChange(next[0]);
    else if (!required) onChange(null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <FacetTrigger
        title={title}
        summary={selected?.label}
        active={selected !== undefined}
        onClear={required ? undefined : () => onChange(null)}
        size={size}
        disabled={disabled}
        data-testid={testId}
      />
      <PopoverContent align="start" aria-label={title} className="w-50 gap-0 p-0">
        <FacetList
          label={title}
          options={options}
          value={value === null ? [] : [value]}
          onChange={handleChange}
          multiple={false}
          clearable={!required}
        />
      </PopoverContent>
    </Popover>
  );
};
