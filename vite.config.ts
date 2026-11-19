import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
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
    copy: [{ from: 'src/style.css', to: 'dist' }],
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
          './style.css': './dist/style.css',
          './package.json': './package.json',
        };
      },
    },
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    printWidth: 80,
    sortImports: true,
    sortPackageJson: true,
    singleQuote: true,
    jsdoc: true,
    ignorePatterns: ['dist', 'CHANGELOG.md', 'coverage', 'pnpm-lock.yaml'],
  },
});
