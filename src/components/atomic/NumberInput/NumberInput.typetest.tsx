import { NumberInput } from './NumberInput';

const change = (value: number | null) => value;

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const NumberInputTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <NumberInput label="a" value={1} onChange={change} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <NumberInput label="a" value={1} onChange={change} style={{}} />
    {/* @ts-expect-error value is a number or null */}
    <NumberInput label="a" value="1" onChange={change} />
    <NumberInput label="a" value={null} onChange={change} min={0} max={9} step="any" endText="km" />
  </div>
);
