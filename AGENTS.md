# ashwa_ui — rules for agents

Public React component library `@ashwa-io/ui`. Full design: `ashwa/docs/superpowers/specs/2026-11-08-ashwa-ui-design-system-design.md`. How-tos: `CONTRIBUTING.md`.

## Hard rules

- `src/components/ui/**` is shadcn CLI output: internal, never exported, **never edited by hand**. Customise only in the public wrapper (its props and class maps passed to the primitive); if a primitive is wrong, work around it in the wrapper or re-add it once shadcn fixes it. The only allowed changes are lint-driven, to make the file match our code style (`yarn lint:fix`, arrow `const` components, import order, anything else our ESLint rules require); never a change in behaviour or styling. Add primitives with `yarn shadcn add <name> --overwrite`, then `git checkout` any existing primitive the CLI touched.
- Public components (`src/components/{atomic,molecule,organism,layout}`) have an allow-listed props interface and never accept `className`, `style`, `asChild` or `render`, never spread props, never import `@base-ui/*`. ESLint (`ashwa-ui/public-api`) and `*.typetest.tsx` enforce this.
- Every public component ships `Name.tsx`, `Name.stories.tsx` (play tests; a11y must pass), `Name.typetest.tsx`, `index.ts` (exports only), and is exported from `src/index.ts`.
- Tokens only in `src/styles/index.css`. Brand defaults must equal `brandTheme(DEFAULT_BRAND_HEX)`. Fix contrast in tokens, not components. Brand text uses `text-brand-text` (≥4.5:1), not `text-primary` / `text-brand` (fills, 3:1).
- Keep `@import './shadcn.css'` (vendored); never depend on `shadcn` at runtime.
- `src/theme/**` stays pure TypeScript: no React, no DOM.
- A scrolling area always runs to its container's edge, so the scrollbar sits on the border. Padding goes inside the scroller, never around it.

## Code style

- Prettier: single quotes, width 100, es5 commas, `arrowParens: avoid`, Tailwind class sorting.
- Components: `interface XProps` + `const X: React.FC<XProps> = props => { const { … } = props; }`. Arrow functions only. React 19 `ref` as a prop.
- Imports: `@/` across folders, `./` inside a component folder; `import/order` with `react` first and `@/**` internal.
- No `any`, no `console.log`, literal class strings only.

## Before you finish

`yarn lint && yarn typecheck && yarn test && yarn build && yarn check:dist`, and add a changeset (`yarn changeset`) when the package changes.
