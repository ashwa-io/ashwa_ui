import { Calendar } from './Calendar';

const change = (value: string) => value;

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const CalendarTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Calendar value={null} onChange={change} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <Calendar value={null} onChange={change} style={{}} />
    {/* @ts-expect-error dates are strings */}
    <Calendar value={new Date()} onChange={change} />
    <Calendar value="2026-01-01" onChange={change} min="2026-01-01" max="2026-12-31" />
  </div>
);
