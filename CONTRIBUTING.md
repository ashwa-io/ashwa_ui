# Contributing

Node ≥ 22.18 (we use 24), `corepack enable`, then `yarn install` and `yarn playwright install chromium`.

## Layout

```
src/
  components/
    ui/          shadcn primitives (CLI-owned, internal, never exported)
    atomic/      public components: Button, Text, Badge, …
    molecule/    public composed components: Modal, DataTable, …
    organism/    public app-shell pieces: AppShell, SideNav, …
    layout/      public layout primitives: Stack, Grid, …
  docs/          foundation stories (tokens)
  lib/           cn, shared prop types
  styles/        index.css (published as @ashwa-io/ui/styles.css), shadcn.css (vendored)
  theme/         brand theme generator (published as @ashwa-io/ui/theme)
  index.ts       public barrel: the only exports of @ashwa-io/ui
test/            repo-level tests (lint guard rules, token drift)
```

## Add a shadcn primitive

```bash
yarn shadcn add dialog
yarn lint:fix
```

The CLI writes straight into `src/components/ui` and `src/styles/index.css` (see `components.json`). Then:

- Convert any `function X()` component to `const X = (…) =>` (house rule; ESLint flags it).
- If the CLI re-adds `@import "shadcn/tailwind.css"`, change it back to `@import './shadcn.css'`. Consumers must not need the shadcn CLI package.
- Never export anything from `ui/`. Wrap it in a public component.
- Never edit `ui/` files by hand: customise in the wrapper. Only `yarn lint:fix` and the arrow-`const` conversion touch them.
- Edit a primitive only to fix accessibility, types or a CLI bug, and say why in the commit.

## Add a public component

Folder `src/components/<layer>/Name/` with:

- `Name.tsx`: `interface NameProps` listing every allowed prop (an allow-list; never `extends ComponentProps<…>`). Declared as `const Name: React.FC<NameProps> = props => { const { … } = props; … }`.
- `Name.stories.tsx`: one story per state, `play` tests for behaviour. Every story also runs the a11y check, which fails on violations, in light (and dark where colours matter).
- `Name.typetest.tsx`: `// @ts-expect-error` lines proving `className`, `style`, `asChild` and `render` are rejected.
- `index.ts`: exports only. Add the component and its types to `src/index.ts`.

Rules (ESLint enforces the first three in the public layers):

1. No `className`, `style`, `asChild` or `render` props.
2. No `{...spread}`: pass every prop by name.
3. No direct `@base-ui/*` imports: go through `@/components/ui`.
4. Shared vocabulary: `size` is `'sm' | 'md' | 'lg'`; `variant` uses semantic names; booleans are `fullWidth`, `loading`, `disabled`, `required`, `invalid`, `readOnly`.
5. Class strings are literal (lookup maps or `cva`), never built from template strings.
6. Keep `ref`, `id`, `aria-*` and `data-testid` where relevant; icon-only controls require `aria-label`.

A new variant or prop is a design decision: open a PR with a changeset.

## Tokens

All tokens live in `src/styles/index.css`. The brand defaults there must equal `brandTheme(DEFAULT_BRAND_HEX)`, and `yarn test` fails if they drift. Fix contrast problems in tokens, not in components.

## Release

1. Every PR that changes the package: `yarn changeset` (pick patch/minor/major, write a line).
2. To release: `yarn version-packages` (bumps `package.json`, writes `CHANGELOG.md`), commit, merge to `main`.
3. `.github/workflows/release.yml` publishes the new version to npm through trusted publishing (provenance included) and tags `vX.Y.Z`.

## Upgrading shadcn

`yarn up shadcn`, then re-copy `node_modules/shadcn/dist/tailwind.css` into `src/styles/shadcn.css` (keep the header comment with the new version).
