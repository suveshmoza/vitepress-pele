import type { EnhanceAppContext, Theme } from 'vitepress';
import { definePeleDiagram } from 'vitepress-pele/client';
import DefaultTheme from 'vitepress/theme';

import { enhanceAppWithDiagramSources } from './diagram-source.ts';

import 'vitepress-pele/style.css';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    definePeleDiagram();
    enhanceAppWithDiagramSources(ctx);
  },
} satisfies Theme;
