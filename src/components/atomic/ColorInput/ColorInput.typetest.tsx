import { ColorInput } from './ColorInput';

const noop = (_value: string) => {};

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const ColorInputTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <ColorInput label="a" value="#000000" onChange={noop} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <ColorInput label="a" value="#000000" onChange={noop} style={{ color: 'red' }} />
    <ColorInput label="a" value="#000000" onChange={noop} error="b" required />
  </div>
);
