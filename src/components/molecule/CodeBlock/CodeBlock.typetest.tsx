import { CodeBlock } from './CodeBlock';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const CodeBlockTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <CodeBlock code="a" className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <CodeBlock code="a" style={{}} />
    {/* @ts-expect-error code is required */}
    <CodeBlock />
    <CodeBlock code="a" size="sm" wrap lineNumbers />
  </div>
);
