import { Alert } from './Alert';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const AlertTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Alert title="a" className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <Alert title="a" style={{}} />
    {/* @ts-expect-error brand is not an alert tone */}
    <Alert title="a" tone="brand" />
    <Alert title="a" tone="danger" description="b" action="c" />
  </div>
);
