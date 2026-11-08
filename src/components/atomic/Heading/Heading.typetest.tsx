import { Heading } from './Heading';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const HeadingTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Heading level={2} className="x">
      a
    </Heading>
    {/* @ts-expect-error style is not part of the public API */}
    <Heading level={2} style={{ color: 'red' }}>
      a
    </Heading>
    {/* @ts-expect-error level is required: it picks h1–h6 */}
    <Heading>a</Heading>
    <Heading level={4} truncate>
      a
    </Heading>
  </div>
);
