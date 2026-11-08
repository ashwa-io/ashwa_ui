import { Card } from './Card';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const CardTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Card className="x">a</Card>
    {/* @ts-expect-error style is not part of the public API */}
    <Card style={{ padding: 2 }}>a</Card>
    {/* @ts-expect-error padding uses the named steps */}
    <Card padding={4}>a</Card>
    <Card padding="lg" onClick={() => {}} aria-label="b">
      a
    </Card>
  </div>
);
