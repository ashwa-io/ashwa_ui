import { Attachment, AttachmentGroup } from './Attachment';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const AttachmentTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Attachment name="a" className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <Attachment name="a" style={{}} />
    {/* @ts-expect-error className is not part of the public API */}
    <AttachmentGroup className="x">a</AttachmentGroup>
    <AttachmentGroup>
      <Attachment name="a" state="uploading" progress={1} size="xs" orientation="vertical" />
    </AttachmentGroup>
  </div>
);
