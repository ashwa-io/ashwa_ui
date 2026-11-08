import { FacetFilterSelect } from './FacetFilterSelect';

const noop = (_value: string | null) => {};
const options = [{ value: 'a', label: 'A' }];

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const FacetFilterSelectTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <FacetFilterSelect title="a" options={options} value={null} onChange={noop} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <FacetFilterSelect title="a" options={options} value={null} onChange={noop} style={{}} />
    {/* @ts-expect-error one choice only: value is a string or null */}
    <FacetFilterSelect title="a" options={options} value={['a']} onChange={noop} />
    <FacetFilterSelect title="a" options={options} value="a" onChange={noop} required size="md" />
  </div>
);
