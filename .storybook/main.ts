import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-themes'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = (viteConfig.plugins ?? []).filter((plugin) => {
      if (plugin && typeof plugin === 'object' && 'name' in plugin) {
        return plugin.name !== 'vite:dts';
      }
      return true;
    });
    return viteConfig;
  },
};

export default config;
