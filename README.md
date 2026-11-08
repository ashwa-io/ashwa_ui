# @ashwa-io/ui

Ashwa's design system: React components built on [shadcn/ui](https://ui.shadcn.com) (Base UI primitives) and Tailwind CSS v4, with a small, locked API and per-organisation brand theming.

- **Locked API.** Components take `variant`, `size` and a few booleans. They never accept `className` or `style`, so screens stay consistent.
- **Org theming.** One brand colour themes the whole app in light and dark mode, with WCAG contrast guaranteed in code.
- **Storybook:** https://ashwa-io.github.io/ashwa_ui/

## Install

```bash
yarn add @ashwa-io/ui react react-dom lucide-react
yarn add -D tailwindcss @tailwindcss/vite
```

Requires React 19 and Tailwind CSS v4 (`@tailwindcss/vite` in your Vite config).

## Styles

In your app's main CSS file, **replace** `@import 'tailwindcss';` with:

```css
@import '@ashwa-io/ui/styles.css';
```

That one import brings Tailwind, the design tokens, the Inter font and the classes the components use. Do not also import `tailwindcss`: it would duplicate the CSS. Your own Tailwind classes and `@theme` additions keep working below the import.

## Use

```tsx
import { Button } from '@ashwa-io/ui';
import { PlusIcon } from 'lucide-react';

<Button variant="primary" icon={PlusIcon} onClick={addVehicle}>
  Add vehicle
</Button>;
```

Layout is your app's job: wrap components in your own elements (`<div className="flex gap-2">…</div>`). Components themselves are never restyled from outside.

## Theming

Dark mode follows a `dark` class on `<html>`.

Org brand colour comes from `@ashwa-io/ui/theme`:

```ts
import { brandThemeCss } from '@ashwa-io/ui/theme';

const style = document.getElementById('org-theme') ?? document.createElement('style');
style.id = 'org-theme';
style.textContent = brandThemeCss(org.primaryColor); // '#1a73e8', or null for the default
document.head.appendChild(style);
```

`brandTheme(hex)` returns the same tokens as data, plus `warnings` (`'adjusted'` when lightness was changed for contrast, `'near-destructive'` when the colour is close to the delete red) for an org-settings preview.

## Develop

```bash
corepack enable
yarn install
yarn playwright install chromium
yarn storybook   # http://localhost:6006
yarn test        # unit tests + every story as a browser test (play functions + a11y)
yarn lint && yarn typecheck && yarn build
```

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT
