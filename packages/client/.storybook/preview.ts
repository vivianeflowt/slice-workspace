import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'light', value: '#fafafa' },
        { name: 'dark', value: '#18181b' },
      ],
    },
    layout: 'centered',
    actions: { argTypesRegex: '^on[A-Z].*' },
  },
};

export default preview;
