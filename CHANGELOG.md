# @ashwa-io/ui

## 0.6.0

### Minor Changes

- `DataTable` reads `--data-table-sticky-top` for where its header sticks. A page that pins a toolbar above the table sets the variable on a wrapper to the toolbar's height, and the column names stay visible under it. Unset, the header sticks to the top as before.

## 0.5.0

### Minor Changes

- `Text` and `Heading` with `truncate` show their full text in a tooltip on hover, only when the text is actually cut off. `ListItem` labels and descriptions and the `TopNav` title do the same. The check runs when the tooltip is about to open, so long lists of truncated text cost no measuring. Remove any `Tooltip` you wrapped around a truncated `Text` to repeat its text.

## 0.4.0

### Minor Changes

- `Tabs` items take an `icon`, and `Tabs` takes `iconOnly` to show just the icons, with each label as the accessible name and a tooltip, for compact view switchers such as grid and list.

### Patch Changes

- A collapsed `SideNav` no longer lets a group's faded label catch the clicks meant for the previous group's last link (for example a vehicle profile's Overview).

## 0.3.0

### Minor Changes

- `Card` takes `fill` to take its parent's full height, so cards side by side in a grid row end level.

### Patch Changes

- A field with a hidden label (`hideLabel`) no longer gives the visually hidden label its text width, which widened the scroll area around it, for example a page showing a second, sideways scrollbar for a table of switches.

## 0.2.0

### Minor Changes

- 591165e: DateRangeInput picks a from and to date from presets or a two-month calendar, with dateRangePresets for an app's own today.

## 0.1.2

### Patch Changes

- 55bb8e4: The active SegmentedControl option is filled with the brand colour.

## 0.1.1

### Patch Changes

- 6830054: IconButton takes a circle shape, and SideNav items take an end icon.

## 0.1.0

### Minor Changes

- 60844bd: First minor release. Facet filters follow nigam: a dashed outline until active, a plus that turns into a clearing cross, and the picked value as plain text. Select options take a description, TextArea takes spellCheck, Checkbox takes indeterminate, and an empty ColorInput no longer shows black. Card goes back to its ring.

## 0.0.19

### Patch Changes

- 10f1cfa: Selected states are neutral like nigam, Card has a real border and soft shadow, the collapse control is labelled, the Checkbox tick no longer flashes black, Avatar takes exact pixels, and selector strings in class names became named utilities.

## 0.0.18

### Patch Changes

- dbd3db4: Tabs takes a line variant, SegmentedControl takes a variant, facet filter triggers are ghost, and the default brand matches nigam's violet in both modes.

## 0.0.17

### Patch Changes

- 01821d3: Modal takes headerActions and dismissOnBackdrop, DateInput takes clearable, and Select shows its placeholder for a value that has no option.

## 0.0.16

### Patch Changes

- 856f2e6: toast takes closeButton, for messages that stay until dismissed.

## 0.0.15

### Patch Changes

- b312464: Popover takes custom trigger content and a flush popup. AppShell can start a collapsible SideNav as a rail.

## 0.0.14

### Patch Changes

- f1f09ee: Required star sits directly after the label text, with no gap.

## 0.0.13

### Patch Changes

- Add Slider, RadioGroup, Toggle, SegmentedControl, Calendar, DateInput, NumberInput, Timestamp, StatusDot and SelectableCard. TextInput gains startText, endText and endAction.

## 0.0.12

### Patch Changes

- Add EmptyState, Alert, Progress, Attachment, HoverCard, AspectRatio, Kbd, Code, CodeBlock, Accordion, Breadcrumb and Drawer. Modal, Drawer and Tabs fade their scrolling edges.

## 0.0.11

### Patch Changes

- Add UIProvider, Link, Button href, SideNav, TopNav and AppShell. Tier 1 is complete.

## 0.0.10

### Patch Changes

- Modal's scrollbar now sits on the dialog's edge instead of inside its padding.

## 0.0.9

### Patch Changes

- Fix the tick in filter lists turning dark when its row is hovered.

## 0.0.8

### Patch Changes

- Add DataTable: sticky header, virtualised rows, and it scrolls with the page rather than inside itself.

## 0.0.7

### Patch Changes

- Add Card, Avatar, Tabs, List and MetadataList. Text colours now reach 4.5:1 on muted and brand-tinted surfaces.

## 0.0.6

### Patch Changes

- Add FacetFilter, FacetFilterSelect, FacetFilterNumber and FilterMenu.

## 0.0.5

### Patch Changes

- Add Tooltip, Popover, DropdownMenu, Modal, ConfirmDialog and Toaster + toast. Colours now follow the nigam shadcn theme (zinc neutrals, multi-colour charts, violet default brand). The theme generator keeps a small contrast margin so brand text stays above 4.5:1 after browser colour rounding.

## 0.0.4

### Patch Changes

- Add FormField, TextInput, TextArea, Select, Checkbox, Switch, ColorInput and FormLayout; inputs are controlled (value + onChange(value)) with built-in label, description and error.

## 0.0.3

### Patch Changes

- Add Text, Heading, Badge, Spinner, Skeleton, Divider, Stack/HStack/VStack and IconButton; add success/warning/info colour tokens and the Tone type.

## 0.0.2

### Patch Changes

- First release published from GitHub Actions through npm trusted publishing, with provenance.
