import type { Env, Token, MarkdownIt } from 'markdown-it';
import { PeleError } from 'pele';

import { pathFromEnv } from './ids.ts';

/**
 * Thrown when a diagram fence fails to render and `onError` is `'throw'`.
 *
 * The message includes the VitePress page path and document line when
 * available.
 */
export class PeleMarkdownError extends Error {
  override readonly name = 'PeleMarkdownError';

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

/**
 * Format a render failure for logs or UI.
 *
 * Prefers Pele’s `code`, line, column, and snippet when `error` is a
 * `PeleError`.
 */
export function formatPeleError(
  error: unknown,
  env: Env | undefined,
  token: Token,
): string {
  const file = pathFromEnv(env) || '<unknown>';

  if (error instanceof PeleError) {
    const line = documentLine(token, error.line);
    const column = error.column > 0 ? ` (column ${error.column})` : '';
    const header = `[vitepress-pele] ${error.code} error in ${file}:${line}${column}`;
    const body = error.snippet || error.message;
    return body ? `${header}\n${body}` : header;
  }

  const line = documentLine(token, 1);
  const message = error instanceof Error ? error.message : String(error);
  return `[vitepress-pele] error in ${file}:${line}\n${message}`;
}

/**
 * HTML error block used when `onError` is `'render'`.
 *
 * Marked with `v-pre` so Vue does not interpret the message body.
 */
export function errorBlock(
  md: MarkdownIt,
  error: unknown,
  env: Env | undefined,
  token: Token,
): string {
  const message = formatPeleError(error, env, token);
  return (
    `<div class="pele-error" role="alert" v-pre>` +
    `<strong>Diagram failed to render</strong>` +
    `<pre><code>${md.utils.escapeHtml(message)}</code></pre>` +
    `</div>`
  );
}

/**
 * Map a 1-based Pele fence line onto the document line (`token.map[0]` +
 * peleLine).
 */
function documentLine(token: Token, peleLine: number): number {
  const fenceLine = token.map?.[0] ?? 0;
  return fenceLine + peleLine;
}
