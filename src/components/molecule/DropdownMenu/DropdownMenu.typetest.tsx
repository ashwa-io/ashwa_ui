import { DropdownMenu } from './DropdownMenu';

const items = [{ label: 'a', onSelect: () => {} }];

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const DropdownMenuTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <DropdownMenu label="a" items={items} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <DropdownMenu label="a" items={items} style={{ color: 'red' }} />
    {/* @ts-expect-error items use onSelect, not onClick */}
    <DropdownMenu label="a" items={[{ label: 'a', onClick: () => {} }]} />
    <DropdownMenu label="a" items={items} variant="ghost" align="end" iconOnly />
  </div>
);
