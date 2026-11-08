import { SegmentedControl } from './SegmentedControl';

const change = (value: string) => value;
const options = [{ value: 'a', label: 'b' }];

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const SegmentedControlTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <SegmentedControl label="a" value="a" onChange={change} options={options} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <SegmentedControl label="a" value="a" onChange={change} options={options} style={{}} />
    <SegmentedControl label="a" value="a" onChange={change} options={options} size="sm" disabled />
  </div>
);
