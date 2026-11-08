import { SelectableCard } from './SelectableCard';

const change = (selected: boolean) => selected;

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const SelectableCardTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <SelectableCard label="a" selected onChange={change} className="x">
      b
    </SelectableCard>
    {/* @ts-expect-error style is not part of the public API */}
    <SelectableCard label="a" selected onChange={change} style={{}}>
      b
    </SelectableCard>
    <SelectableCard label="a" selected onChange={change} padding="sm" disabled>
      b
    </SelectableCard>
  </div>
);
