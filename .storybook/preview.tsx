import type { Decorator, Preview } from '@storybook/react-vite';

import '../src/styles/index.css';
import { brandThemeCss, DEFAULT_BRAND_HEX } from '../src/theme';

// Same id the apps use for the runtime org theme, so stories render exactly like an org.
const ORG_THEME_STYLE_ID = 'org-theme';

const BRAND_PRESETS = [
  { value: DEFAULT_BRAND_HEX, title: 'Ashwa violet (default)' },
  { value: '#1a73e8', title: 'Blue (org editor default)' },
  { value: '#16a34a', title: 'Green' },
  { value: '#ff0000', title: 'Red (near destructive)' },
  { value: '#ffff00', title: 'Yellow (needs adjusting)' },
];

const withTheme: Decorator = (Story, context) => {
  const { theme, brand } = context.globals;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  let style = document.getElementById(ORG_THEME_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = ORG_THEME_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = brandThemeCss(brand);
  return <Story />;
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Light or dark mode',
      toolbar: { title: 'Theme', icon: 'mirror', items: ['light', 'dark'], dynamicTitle: true },
    },
    brand: {
      description: 'Org brand colour',
      toolbar: { title: 'Brand', icon: 'paintbrush', items: BRAND_PRESETS, dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light', brand: DEFAULT_BRAND_HEX },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Accessibility violations fail story tests (and CI).
    a11y: { test: 'error' },
  },
};

export default preview;
