import { List, ListItem } from './List';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const ListTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <List className="x">a</List>
    {/* @ts-expect-error style is not part of the public API */}
    <List style={{}}>a</List>
    {/* @ts-expect-error className is not part of the public API */}
    <ListItem label="a" className="x" />
    {/* @ts-expect-error label is required */}
    <ListItem />
    <List density="compact" aria-label="b">
      <ListItem label="a" description="b" onClick={() => {}} selected size="sm" />
    </List>
  </div>
);
