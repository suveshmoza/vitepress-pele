import { defineConfig } from 'vite-plus';

export default defineConfig({
  defaultPackage: {
    dev: './apps/docs',
    build: './apps/docs',
    preview: './apps/docs',
    pack: './packages/vitepress-pele',
  },
  run: {
    cache: true,
  },
  staged: {
    '*': 'vp check --fix',
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
    ignorePatterns: [
      'dist',
      '**/CHANGELOG.md',
      'coverage',
      'pnpm-lock.yaml',
      'apps/docs/.vitepress/cache',
      'apps/docs/.vitepress/dist',
    ],
  },
});
