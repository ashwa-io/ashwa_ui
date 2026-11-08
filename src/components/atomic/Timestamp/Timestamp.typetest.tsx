import { Timestamp } from './Timestamp';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const TimestampTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Timestamp value="a" className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <Timestamp value="a" style={{}} />
    {/* @ts-expect-error relative is not a format */}
    <Timestamp value="a" format="relative" />
    <Timestamp value={1} format="time" size="sm" />
  </div>
);
