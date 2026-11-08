import { DateInput } from './DateInput';

const change = (value: string | null) => value;

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const DateInputTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <DateInput label="a" value={null} onChange={change} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <DateInput label="a" value={null} onChange={change} style={{}} />
    <DateInput label="a" value="2026-01-01" onChange={change} min="2026-01-01" size="sm" />
  </div>
);
