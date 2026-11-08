import path from 'node:path';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

// Inherit the Vite config (React, Tailwind, @ alias) so stories render exactly as in Storybook.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          test: {
            name: 'unit',
            environment: 'node',
            include: ['src/**/*.test.ts', 'test/**/*.test.ts'],
          },
        },
        {
          extends: true,
          // Runs every story (play functions + a11y) in headless Chromium.
          plugins: [storybookTest({ configDir: path.join(import.meta.dirname, '.storybook') })],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              provider: playwright({}),
              instances: [{ browser: 'chromium' }],
            },
          },
        },
      ],
    },
  })
);
