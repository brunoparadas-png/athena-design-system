import type { Preview } from '@storybook/react-vite';
import '../src/tokens/tokens.css';

const preview: Preview = {
  parameters: {
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
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
