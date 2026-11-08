import { Checkbox } from './Checkbox';

const noop = (_value: boolean) => {};

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const CheckboxTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Checkbox label="a" value={false} onChange={noop} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <Checkbox label="a" value={false} onChange={noop} style={{ color: 'red' }} />
    {/* @ts-expect-error value is a boolean */}
    <Checkbox label="a" value="on" onChange={noop} />
    <Checkbox label="a" value onChange={noop} description="b" hideLabel />
  </div>
);
