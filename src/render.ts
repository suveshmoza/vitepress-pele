import { render, type RenderOptions, type RenderResult } from 'pele';

/**
 * Pele render options callers may set.
 *
 * Omits `idPrefix`, `maxWidth`, and `responsive` — the plugin sets those.
 */
export type PeleRenderOptions = Omit<
  RenderOptions,
  'idPrefix' | 'maxWidth' | 'responsive'
>;

/** Render Mermaid (or other Pele) source to SVG via `pele`. */
export function renderDiagram(
  source: string,
  options: RenderOptions,
): RenderResult {
  return render(source, options);
}
