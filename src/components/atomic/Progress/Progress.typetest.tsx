import { Progress } from './Progress';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const ProgressTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Progress label="a" className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <Progress label="a" style={{}} />
    {/* @ts-expect-error label is required */}
    <Progress value={1} />
    <Progress label="a" value={null} hideLabel />
  </div>
);
