import { MetadataList, MetadataListItem } from './MetadataList';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const MetadataListTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <MetadataList className="x">a</MetadataList>
    {/* @ts-expect-error style is not part of the public API */}
    <MetadataList style={{}}>a</MetadataList>
    {/* @ts-expect-error columns are 1 | 2 | 3 */}
    <MetadataList columns={5}>a</MetadataList>
    {/* @ts-expect-error label is required */}
    <MetadataListItem>a</MetadataListItem>
    <MetadataList columns={2}>
      <MetadataListItem label="a">b</MetadataListItem>
    </MetadataList>
  </div>
);
