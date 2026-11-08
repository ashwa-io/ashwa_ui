import { Accordion } from './Accordion';

const items = [{ value: 'a', title: 'b', content: 'c' }];

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const AccordionTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Accordion items={items} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <Accordion items={items} style={{}} />
    <Accordion items={items} multiple defaultValue={['a']} />
  </div>
);
