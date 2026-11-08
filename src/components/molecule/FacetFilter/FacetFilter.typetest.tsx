import { FacetFilter } from './FacetFilter';

const noop = (_value: string[]) => {};
const options = [{ value: 'a', label: 'A' }];

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const FacetFilterTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <FacetFilter title="a" options={options} value={[]} onChange={noop} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <FacetFilter title="a" options={options} value={[]} onChange={noop} style={{}} />
    {/* @ts-expect-error value is the list of selected option values */}
    <FacetFilter title="a" options={options} value="a" onChange={noop} />
    {/* @ts-expect-error onChange receives the values, not an event */}
    <FacetFilter title="a" options={options} value={[]} onChange={(_e: Event) => {}} />
    <FacetFilter title="a" options={options} value={['a']} onChange={noop} size="md" disabled />
  </div>
);
