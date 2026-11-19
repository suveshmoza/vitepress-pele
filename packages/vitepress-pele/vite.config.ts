import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    entry: {
      index: 'src/index.ts',
      client: 'src/client.ts',
    },
    platform: 'neutral',
    dts: {
      generator: 'tsgo',
    },
    outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
    copy: [
      { from: 'src/style.css', to: 'dist' },
      { from: 'src/style.css.d.ts', to: 'dist' },
    ],
    deps: {
      // Peers stay external; VitePress provides markdown-it, the host provides pele.
      neverBundle: ['markdown-it', 'pele'],
      // Keep pele/core as a bare specifier so the site's bundler resolves it.
      resolveDepSubpath: false,
    },
    exports: {
      // Avoid listing type-only peers as if they were shipped in the tarball.
      inlinedDependencies: false,
      customExports() {
        return {
          '.': {
            types: './dist/index.d.ts',
            import: './dist/index.js',
          },
          './client': {
            types: './dist/client.d.ts',
            import: './dist/client.js',
          },
          './style.css': {
            types: './dist/style.css.d.ts',
            default: './dist/style.css',
          },
          './package.json': './package.json',
        };
      },
    },
  },
});
