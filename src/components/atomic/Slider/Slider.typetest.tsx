import { Slider } from './Slider';

const change = (value: number) => value;

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const SliderTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Slider label="a" value={1} onChange={change} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <Slider label="a" value={1} onChange={change} style={{}} />
    {/* @ts-expect-error a single value, not a range */}
    <Slider label="a" value={[1, 2]} onChange={change} />
    <Slider label="a" value={1} onChange={change} onCommit={change} min={0} max={9} step={3} />
  </div>
);
