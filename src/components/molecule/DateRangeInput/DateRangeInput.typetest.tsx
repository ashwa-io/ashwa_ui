import { DateRangeInput } from './DateRangeInput';
import type { DateRangeValue } from './dateRangePresets';

const change = (value: DateRangeValue) => value;
const empty: DateRangeValue = { from: null, to: null };

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const DateRangeInputTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <DateRangeInput label="a" value={empty} onChange={change} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <DateRangeInput label="a" value={empty} onChange={change} style={{}} />
    {/* @ts-expect-error a range is an object, not a single date string */}
    <DateRangeInput label="a" value="2026-01-01" onChange={change} />
    <DateRangeInput
      label="a"
      value={{ from: '2026-01-01', to: '2026-01-31' }}
      onChange={change}
      presets={[{ label: 'January', range: () => ({ from: '2026-01-01', to: '2026-01-31' }) }]}
      min="2026-01-01"
      size="sm"
      align="end"
      numberOfMonths={1}
    />
  </div>
);
