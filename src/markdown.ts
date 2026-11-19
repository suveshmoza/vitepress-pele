import type { MarkdownIt } from 'markdown-it';
import type { RenderOptions, RenderResult } from 'pele';

import { errorBlock, formatPeleError, PeleMarkdownError } from './errors.ts';
import { idPrefixFor } from './ids.ts';
import { renderDiagram, type PeleRenderOptions } from './render.ts';

export interface PeleMarkdownOptions {
  /**
   * Max diagram width in CSS pixels.
   *
   * @default 688
   */
  maxWidth?: number;
  /**
   * Fence languages that render as Pele diagrams.
   *
   * @default ['mermaid']
   */
  languages?: string[];
  /**
   * Extra Pele render options. `idPrefix`, `maxWidth`, and `responsive` are set
   * by the plugin.
   */
  render?: PeleRenderOptions;
  /**
   * How to handle render failures.
   *
   * - `'throw'` — throw {@link PeleMarkdownError} (default)
   * - `'render'` — emit an HTML error block instead
   *
   * @default 'throw'
   */
  onError?: 'throw' | 'render';
  /**
   * When `true`, set `data-pele-source` on `<pele-diagram>` to the URL-encoded
   * fence body.
   *
   * @default false
   */
  source?: boolean;
  /**
   * Class name on `<pele-diagram>`.
   *
   * @default 'pele-diagram'
   */
  className?: string;
}

interface ResolvedPeleMarkdownOptions {
  maxWidth: number;
  languages: readonly string[];
  render: PeleRenderOptions;
  onError: 'throw' | 'render';
  source: boolean;
  className: string;
}

/**
 * Markdown-it plugin that renders matching code fences as Pele SVG diagrams.
 *
 * Install with `md.use(peleMarkdown())`. Non-matching fences use the default
 * markdown-it fence renderer.
 *
 * @example
 *   ```ts
 *   import MarkdownIt from 'markdown-it';
 *   import { peleMarkdown } from 'vitepress-pele';
 *
 *   const md = new MarkdownIt();
 *   md.use(peleMarkdown({ onError: 'render' }));
 *   ```;
 */
export function peleMarkdown(
  options: PeleMarkdownOptions = {},
): (md: MarkdownIt) => void {
  const config = resolveOptions(options);
  return (md) => {
    const base = md.renderer.rules.fence;
    md.renderer.rules.fence = (tokens, idx, opts, env, self) => {
      const renderDefault = (): string =>
        base
          ? base(tokens, idx, opts, env, self)
          : self.renderToken(tokens, idx, opts);

      const token = tokens[idx];
      if (!token) {
        return renderDefault();
      }

      const lang = token.info.trim().split(/\s+/)[0] ?? '';
      if (!config.languages.includes(lang)) {
        return renderDefault();
      }

      const source = token.content.replace(/\r\n?/g, '\n');
      try {
        const diagram = renderDiagram(source, {
          ...config.render,
          idPrefix: idPrefixFor(env, token),
          maxWidth: config.maxWidth,
          responsive: true,
        } satisfies RenderOptions);
        return emit(diagram, source, config);
      } catch (error) {
        if (config.onError === 'render') {
          return errorBlock(md, error, env, token);
        }
        throw new PeleMarkdownError(formatPeleError(error, env, token), {
          cause: error,
        });
      }
    };
  };
}

function resolveOptions(
  options: PeleMarkdownOptions,
): ResolvedPeleMarkdownOptions {
  return {
    maxWidth: options.maxWidth ?? 688,
    languages: options.languages ?? ['mermaid'],
    render: options.render ?? {},
    onError: options.onError ?? 'throw',
    source: options.source ?? false,
    className: options.className ?? 'pele-diagram',
  };
}

/** Wrap a Pele render result in the `<figure>` / `<pele-diagram>` HTML shell. */
function emit(
  diagram: RenderResult,
  source: string,
  config: ResolvedPeleMarkdownOptions,
): string {
  const sourceAttr = config.source
    ? ` data-pele-source="${encodeURIComponent(source)}"`
    : '';
  return (
    `<figure class="pele-figure" v-pre>` +
    `<pele-diagram class="${escapeAttr(config.className)}" data-pele-type="${escapeAttr(diagram.type)}"${sourceAttr}>` +
    `<div class="pele-canvas">${diagram.svg}</div>` +
    `</pele-diagram>` +
    `</figure>`
  );
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}
