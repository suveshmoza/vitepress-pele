import { defineConfig } from 'vitepress';
import { peleMarkdown } from 'vitepress-pele';

export default defineConfig({
  title: 'vitepress-pele',
  description:
    'VitePress plugin that renders Mermaid fences as SVG diagrams with Pele.',
  // Logo is a dark ember card — start in dark so the brand reads correctly.
  appearance: 'dark',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['meta', { property: 'og:image', content: '/logo.png' }],
    ['meta', { name: 'theme-color', content: '#1a0c08' }],
  ],
  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'vitepress-pele',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Examples', link: '/examples/' },
      {
        text: 'Pele',
        link: 'https://pele.run/examples',
      },
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
        text: 'Examples',
        items: [
          { text: 'Overview', link: '/examples/' },
          { text: 'Flowchart', link: '/examples/flowchart' },
          { text: 'Sequence', link: '/examples/sequence' },
          { text: 'Structure', link: '/examples/structure' },
          { text: 'Charts', link: '/examples/charts' },
          { text: 'Advanced', link: '/examples/advanced' },
        ],
      },
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/suveshmoza/vitepress-pele',
      },
    ],
    editLink: {
      pattern:
        'https://github.com/suveshmoza/vitepress-pele/edit/main/apps/docs/:path',
      text: 'Edit this page',
    },
  },
  markdown: {
    config(md) {
      md.use(
        // @ts-expect-error VitePress types md via @types/markdown-it@14; workspace markdown-it@15 exports incompatible MarkdownIt types.
        peleMarkdown({
          // Wide Pele examples (C4, sankey, git) need more than the default.
          maxWidth: 900,
          // Expose fence bodies so the theme can show “View markdown”.
          source: true,
        }),
      );
    },
  },
});
