import { Switch } from './Switch';

const noop = (_value: boolean) => {};

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const SwitchTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Switch label="a" value={false} onChange={noop} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <Switch label="a" value={false} onChange={noop} style={{ color: 'red' }} />
    {/* @ts-expect-error value is a boolean */}
    <Switch label="a" value="on" onChange={noop} />
    <Switch label="a" value onChange={noop} description="b" />
  </div>
);
