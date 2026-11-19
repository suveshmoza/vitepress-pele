import { defineConfig } from 'vitepress';
import { peleMarkdown } from 'vitepress-pele';

export default defineConfig({
  title: 'vitepress-pele',
  description:
    'VitePress plugin that renders Mermaid fences as SVG diagrams with Pele.',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Demos', link: '/demos/' },
      {
        text: 'GitHub',
        link: 'https://github.com/suveshmoza/vitepress-pele',
      },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Options', link: '/guide/options' },
        ],
      },
      {
        text: 'Demos',
        items: [{ text: 'Live diagrams', link: '/demos/' }],
      },
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/suveshmoza/vitepress-pele',
      },
    ],
  },
  markdown: {
    config(md) {
      // @ts-expect-error VitePress types md via @types/markdown-it@14; workspace markdown-it@15 exports incompatible MarkdownIt types.
      md.use(peleMarkdown());
    },
  },
});
