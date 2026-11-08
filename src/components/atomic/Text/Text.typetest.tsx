import { Text } from './Text';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const TextTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Text className="x">a</Text>
    {/* @ts-expect-error style is not part of the public API */}
    <Text style={{ color: 'red' }}>a</Text>
    {/* @ts-expect-error headings use Heading, not Text */}
    <Text as="h2">a</Text>
    <Text as="span" size="xs" tone="muted" weight="medium" truncate>
      a
    </Text>
  </div>
);
