import { FacetFilterNumber, type NumberFilterValue } from './FacetFilterNumber';

const noop = (_value: NumberFilterValue | null) => {};
const list = [{ value: 'gt', label: 'Greater than' }];

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const FacetFilterNumberTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <FacetFilterNumber title="a" conditions={list} value={null} onChange={noop} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <FacetFilterNumber title="a" conditions={list} value={null} onChange={noop} style={{}} />
    {/* @ts-expect-error value is a condition object or null */}
    <FacetFilterNumber title="a" conditions={list} value={5} onChange={noop} />
    <FacetFilterNumber
      title="a"
      conditions={list}
      value={{ condition: 'gt', from: '1', to: '' }}
      onChange={noop}
      format={value => `${value} km`}
    />
  </div>
);
