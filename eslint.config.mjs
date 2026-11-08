import { fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import * as tseslint from 'typescript-eslint';

const sourceGlobs = ['**/*.{js,jsx,ts,tsx,mjs}'];

export default defineConfig([
  globalIgnores(['**/dist/**', '**/storybook-static/**', '**/coverage/**', '.yarn/**']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  ...storybook.configs['flat/recommended'],
  {
    name: 'import/prettier-conflicts',
    files: sourceGlobs,
    rules: {
      'import/newline-after-import': 'off',
      'import/group-exports': 'off',
    },
  },
  {
    name: 'ashwa-ui/base',
    files: sourceGlobs,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2024,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: fixupPluginRules(reactPlugin),
      'react-hooks': fixupPluginRules(reactHooksPlugin),
      'jsx-a11y': fixupPluginRules(jsxA11yPlugin),
      import: fixupPluginRules(importPlugin),
      'react-refresh': reactRefreshPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Keep ESLint in sync with Prettier (including Tailwind class sorting)
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          printWidth: 100,
        },
      ],

      // React rules
      'react/jsx-no-useless-fragment': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Import rules
      'import/prefer-default-export': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',

      // React Refresh rules
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Console rules
      'no-console': ['error', { allow: ['warn', 'error'] }],

      // Airbnb-style rules
      'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    },
  },
  {
    // The locked public API (spec §9): apps cannot restyle components.
    name: 'ashwa-ui/public-api',
    files: ['src/components/{atomic,molecule,organism,layout}/**/*.{ts,tsx}'],
    ignores: ['**/*.stories.tsx', '**/*.typetest.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'TSPropertySignature[key.name=/^(className|style|asChild|render)$/], TSPropertySignature[key.value=/^(className|style|asChild|render)$/]',
          message: 'Public components never accept className, style, asChild or render (spec §9).',
        },
        {
          // Inheriting DOM props re-opens className/style; list allowed props instead.
          selector: [
            'TSInterfaceHeritage[expression.name=/^(ComponentProps\\w*|\\w*HTMLAttributes)$/]',
            'TSInterfaceHeritage[expression.property.name=/^(ComponentProps\\w*|\\w*HTMLAttributes)$/]',
            'TSInterfaceHeritage TSTypeReference[typeName.name=/^(ComponentProps\\w*|\\w*HTMLAttributes)$/]',
            'TSInterfaceHeritage TSTypeReference[typeName.right.name=/^(ComponentProps\\w*|\\w*HTMLAttributes)$/]',
            'TSIntersectionType TSTypeReference[typeName.name=/^(ComponentProps\\w*|\\w*HTMLAttributes)$/]',
            'TSIntersectionType TSTypeReference[typeName.right.name=/^(ComponentProps\\w*|\\w*HTMLAttributes)$/]',
          ].join(', '),
          message:
            'Public props are an allow-list: never extend or intersect ComponentProps / HTMLAttributes (spec §9.1).',
        },
        {
          selector: 'JSXSpreadAttribute',
          message: 'Pass props by name in public components (spec §9).',
        },
        {
          selector:
            'CallExpression[callee.property.name=/^(createElement|cloneElement)$/], CallExpression[callee.name=/^(createElement|cloneElement)$/]',
          message: 'Render JSX with named props in public components (spec §9).',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@base-ui/*', '@base-ui/react'],
              message: 'Wrap primitives from @/components/ui instead (spec §9).',
            },
          ],
        },
      ],
    },
  },
]);
