import type React from 'react';

import { Button } from '@/components/atomic/Button';
import { Select } from '@/components/atomic/Select';
import { FacetTrigger, type FacetSize } from '@/components/molecule/FacetFilter/FacetTrigger';
import { FormField } from '@/components/molecule/FormField';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent } from '@/components/ui/popover';

export interface NumberCondition {
  /** e.g. 'gt', 'between'. */
  value: string;
  /** e.g. 'Greater than'. */
  label: string;
  /** Takes two values: from and to. */
  range?: boolean;
}

export interface NumberFilterValue {
  condition: string;
  /** As typed; '' when empty. */
  from: string;
  /** Only used by range conditions. */
  to: string;
}

export interface FacetFilterNumberProps {
  title: string;
  conditions: NumberCondition[];
  value: NumberFilterValue | null;
  onChange: (value: NumberFilterValue | null) => void;
  /** Formats values in the trigger, e.g. value => `${value} km/h`. */
  format?: (value: string) => string;
  size?: FacetSize;
  disabled?: boolean;
  'data-testid'?: string;
}

const NumberField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = props => (
  <FormField label={props.label}>
    {control => (
      <Input
        id={control.id}
        type="number"
        value={props.value}
        onChange={event => props.onChange(event.target.value)}
      />
    )}
  </FormField>
);

const summarize = (
  value: NumberFilterValue,
  condition: NumberCondition,
  format: (value: string) => string
): string => {
  if (value.from === '') return condition.label;
  const from = `${condition.label} ${format(value.from)}`;
  return condition.range && value.to !== '' ? `${from} and ${format(value.to)}` : from;
};

export const FacetFilterNumber: React.FC<FacetFilterNumberProps> = props => {
  const {
    title,
    conditions,
    value,
    onChange,
    format = text => text,
    size,
    disabled,
    'data-testid': testId,
  } = props;
  const condition = conditions.find(item => item.value === value?.condition);
  const from = value?.from ?? '';
  const to = value?.to ?? '';

  return (
    <Popover>
      <FacetTrigger
        title={title}
        summary={value && condition ? summarize(value, condition, format) : 'All'}
        active={condition !== undefined}
        size={size}
        disabled={disabled}
        data-testid={testId}
      />
      <PopoverContent align="start" aria-label={title} className="w-64">
        <Select
          label="Condition"
          options={conditions.map(item => ({ value: item.value, label: item.label }))}
          value={condition?.value ?? null}
          onChange={next => onChange({ condition: next, from, to: '' })}
          placeholder="Select condition"
        />
        {value && condition && !condition.range && (
          <NumberField
            label="Value"
            value={from}
            onChange={next => onChange({ condition: value.condition, from: next, to: '' })}
          />
        )}
        {value && condition?.range && (
          <div className="grid grid-cols-2 gap-2">
            <NumberField
              label="From"
              value={from}
              onChange={next => onChange({ condition: value.condition, from: next, to })}
            />
            <NumberField
              label="To"
              value={to}
              onChange={next => onChange({ condition: value.condition, from, to: next })}
            />
          </div>
        )}
        {value && (
          <Button variant="ghost" size="sm" fullWidth onClick={() => onChange(null)}>
            Clear filter
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};
