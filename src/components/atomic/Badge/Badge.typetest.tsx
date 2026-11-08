import { Badge } from './Badge';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const BadgeTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Badge className="x">a</Badge>
    {/* @ts-expect-error style is not part of the public API */}
    <Badge style={{ color: 'red' }}>a</Badge>
    {/* @ts-expect-error tones use the shared vocabulary: 'danger', not 'error' */}
    <Badge tone="error">a</Badge>
    <Badge tone="danger">a</Badge>
  </div>
);
