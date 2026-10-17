import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

import clerk from '@clerk/astro';

import { remarkAlert } from 'remark-github-blockquote-alert';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.mograblog.com',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    clerk(),
  ],
  output: 'static',
  adapter: cloudflare({
    imageService: 'cloudflare',
  }),
  markdown: {
    remarkPlugins: [remarkAlert],
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },
});
