import { Tabs } from './Tabs';

const noop = (_value: string) => {};
const items = [{ value: 'a', label: 'A' }];

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const TabsTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Tabs items={items} value="a" onChange={noop} aria-label="b" className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <Tabs items={items} value="a" onChange={noop} aria-label="b" style={{}} />
    {/* @ts-expect-error aria-label is required: it names the tab list */}
    <Tabs items={items} value="a" onChange={noop} />
    <Tabs items={items} value="a" onChange={noop} aria-label="b" size="sm" variant="line" />
  </div>
);
