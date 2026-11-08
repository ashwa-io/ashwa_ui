import type React from 'react';

import { Popover, PopoverContent } from '@/components/ui/popover';

import { FacetList, type FacetOption } from './FacetList';
import { FacetTrigger, type FacetSize } from './FacetTrigger';

export interface FacetFilterProps {
  title: string;
  options: FacetOption[];
  /** Selected option values. */
  value: string[];
  onChange: (value: string[]) => void;
  size?: FacetSize;
  disabled?: boolean;
  'data-testid'?: string;
}

export const FacetFilter: React.FC<FacetFilterProps> = props => {
  const { title, options, value, onChange, size, disabled, 'data-testid': testId } = props;
  const selected = options.filter(option => value.includes(option.value)).length;
  const active = selected > 0 && selected < options.length;

  return (
    <Popover>
      <FacetTrigger
        title={title}
        summary={active ? String(selected) : 'All'}
        active={active}
        size={size}
        disabled={disabled}
        data-testid={testId}
      />
      <PopoverContent align="start" aria-label={title} className="w-60 gap-0 p-0">
        <FacetList
          label={title}
          options={options}
          value={value}
          onChange={onChange}
          showSelectAll
        />
      </PopoverContent>
    </Popover>
  );
};
