import { FileDropzone } from './FileDropzone';

const onFiles = (files: File[]) => files.length;

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const FileDropzoneTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <FileDropzone onFiles={onFiles} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <FileDropzone onFiles={onFiles} style={{}} />
    {/* @ts-expect-error render is not part of the public API */}
    <FileDropzone onFiles={onFiles} render={<div />} />
    {/* @ts-expect-error asChild is not part of the public API */}
    <FileDropzone onFiles={onFiles} asChild />
    {/* @ts-expect-error onFiles is required: a dropzone that keeps nothing is a bug */}
    <FileDropzone />
    <FileDropzone
      onFiles={onFiles}
      title="Drop the bill here"
      hint="JPG, PNG, WebP or PDF"
      accept="image/*,application/pdf"
      multiple
      camera
      paste
      disabled
    />
  </div>
);
