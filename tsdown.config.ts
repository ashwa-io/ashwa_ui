import { defineConfig } from 'tsdown';

// One ESM file per module (tree-shakable) plus .d.ts. Dependencies and peers stay external
// automatically; never add a custom deps.neverBundle (it breaks @/ rewriting in .d.ts).
export default defineConfig({
  entry: ['src/index.ts', 'src/theme.ts'],
  format: 'esm',
  unbundle: true,
  dts: true,
  platform: 'neutral',
  clean: true,
  // Root tsconfig is references-only; the app project holds src and the @/ paths.
  tsconfig: 'tsconfig.app.json',
});
