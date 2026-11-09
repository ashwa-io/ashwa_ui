import { TextArea } from './TextArea';

const noop = (_value: string) => {};

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const TextAreaTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <TextArea label="a" value="" onChange={noop} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <TextArea label="a" value="" onChange={noop} style={{ color: 'red' }} />
    {/* @ts-expect-error label is required: it is the accessible name */}
    <TextArea value="" onChange={noop} />
    <TextArea label="a" value="" onChange={noop} rows={5} maxLength={200} spellCheck={false} />
  </div>
);
