import { Select } from './Select';

const noop = (_value: string) => {};
const options = [{ value: 'a', label: 'A' }];

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const SelectTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Select label="a" options={options} value={null} onChange={noop} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <Select label="a" options={options} value={null} onChange={noop} style={{ color: 'red' }} />
    {/* @ts-expect-error options are { value, label } objects, not plain strings */}
    <Select label="a" options={['a']} value={null} onChange={noop} />
    <Select label="a" options={options} value="a" onChange={noop} placeholder="Pick" required />
  </div>
);
