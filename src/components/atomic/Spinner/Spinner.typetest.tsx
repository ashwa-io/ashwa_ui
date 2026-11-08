import { Spinner } from './Spinner';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const SpinnerTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Spinner className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <Spinner style={{ color: 'red' }} />
    <Spinner size="lg" label="Loading devices" />
  </div>
);
