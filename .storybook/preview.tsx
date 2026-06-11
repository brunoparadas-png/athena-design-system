import type { Preview } from '@storybook/react-vite';
import '../src/styles/tailwind.css';
import athenaTheme from './theme';

const preview: Preview = {
  parameters: {
    options: {
      // Sort the sidebar alphabetically (by title, then story name).
      storySort: { method: 'alphabetical' },
    },
    docs: {
      theme: athenaTheme,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'canvas',
      values: [
        { name: 'canvas', value: '#ffffff' },
        { name: 'page', value: '#f5f5f5' },
      ],
    },
    a11y: {
      // 'error' fails CI on violations — appropriate for an a11y-first DS.
      test: 'error',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ fontFamily: '"Inter", system-ui, sans-serif' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
