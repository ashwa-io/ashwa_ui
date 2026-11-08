import { Code } from './Code';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const CodeTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Code className="x">a</Code>
    {/* @ts-expect-error style is not part of the public API */}
    <Code style={{}}>a</Code>
    <Code>a</Code>
  </div>
);
