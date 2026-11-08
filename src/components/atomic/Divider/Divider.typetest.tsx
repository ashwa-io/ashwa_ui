import { Divider } from './Divider';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const DividerTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Divider className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <Divider style={{ height: 20 }} />
    <Divider orientation="vertical" />
  </div>
);
