// Patterns used by check-dist.mjs, kept separate so test/distRules.test.ts can pin them.

/**
 * Any import, re-export, dynamic or bare side-effect import of an unresolved `@/` alias
 * (tsdown #833 can leave these in .d.ts, e.g. `import "@/components/…";`).
 */
export const ALIAS_IMPORT = /(?:\bfrom\s*|\bimport\s*\(?\s*)['"]@\//;

/** Files that must never ship. */
export const DEV_ONLY = /\.(test|stories|typetest)\./;
