import { HStack, Stack } from './Stack';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const StackTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Stack className="x">a</Stack>
    {/* @ts-expect-error style is not part of the public API */}
    <Stack style={{ gap: 3 }}>a</Stack>
    {/* @ts-expect-error gap uses the spacing steps only */}
    <Stack gap={7}>a</Stack>
    {/* @ts-expect-error HStack is always a row */}
    <HStack direction="column">a</HStack>
    <HStack gap={2} align="center" justify="between" wrap>
      a
    </HStack>
  </div>
);
