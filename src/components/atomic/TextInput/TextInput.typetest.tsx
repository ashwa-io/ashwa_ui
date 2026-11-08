import { TextInput } from './TextInput';

const noop = (_value: string) => {};

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const TextInputTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <TextInput label="a" value="" onChange={noop} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <TextInput label="a" value="" onChange={noop} style={{ color: 'red' }} />
    {/* @ts-expect-error label is required: it is the accessible name */}
    <TextInput value="" onChange={noop} />
    {/* @ts-expect-error onChange receives the value, not the event */}
    <TextInput label="a" value="" onChange={(_event: React.ChangeEvent<HTMLInputElement>) => {}} />
    {/* @ts-expect-error numbers get their own input later */}
    <TextInput label="a" value="" onChange={noop} type="number" />
    <TextInput label="a" value="" onChange={noop} type="email" required error="b" />
  </div>
);
