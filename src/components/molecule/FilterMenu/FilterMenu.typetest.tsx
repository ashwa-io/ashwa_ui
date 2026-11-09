import { FilterMenu, type FilterMenuValue } from './FilterMenu';

const noop = (_value: FilterMenuValue) => {};
const list = [{ id: 'a', label: 'A', options: [{ value: 'b', label: 'B' }] }];

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const FilterMenuTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <FilterMenu categories={list} value={{}} onChange={noop} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <FilterMenu categories={list} value={{}} onChange={noop} style={{}} />
    {/* @ts-expect-error value maps a category id to its selected values */}
    <FilterMenu categories={list} value={[]} onChange={noop} />
    <FilterMenu categories={list} value={{ a: ['b'] }} onChange={noop} label="Filters" size="sm" />
    <FilterMenu categories={list} value={{}} onChange={noop} variant="ghost" />
  </div>
);
