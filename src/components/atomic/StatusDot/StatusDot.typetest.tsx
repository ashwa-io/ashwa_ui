import { StatusDot } from './StatusDot';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const StatusDotTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <StatusDot label="a" className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <StatusDot label="a" style={{}} />
    {/* @ts-expect-error label is required */}
    <StatusDot tone="success" />
    <StatusDot label="a" tone="danger" />
  </div>
);
