import { enableZoom, type Zoom, type ZoomOptions } from 'pele/core';

export interface DefinePeleDiagramOptions {
  /**
   * Pele zoom options. By default, zoom is enabled only when the diagram was
   * shrunk to fit.
   */
  zoom?: ZoomOptions;
  /**
   * Custom element tag to register.
   *
   * @default 'pele-diagram'
   */
  tag?: string;
}

/**
 * Register the `<pele-diagram>` custom element so diagrams get Pele zoom.
 *
 * Call once from VitePress `enhanceApp`. Safe to call again; a second
 * registration for the same tag is ignored.
 *
 * @example
 *   ```ts
 *   // .vitepress/theme/index.ts
 *   import { definePeleDiagram } from 'vitepress-pele/client';
 *   import 'vitepress-pele/style.css';
 *
 *   export default {
 *     enhanceApp() {
 *       definePeleDiagram();
 *     },
 *   };
 *   ```;
 */
export function definePeleDiagram(
  options: DefinePeleDiagramOptions = {},
): void {
  const tag = options.tag ?? 'pele-diagram';
  if (customElements.get(tag)) return;

  const zoomOptions = options.zoom;

  class PeleDiagramElement extends HTMLElement {
    #zoom: Zoom | undefined;
    #frame = 0;
    #observer: ResizeObserver | undefined;

    connectedCallback(): void {
      // Wait one frame so Vue can finish hydrating the v-pre subtree.
      this.#frame = requestAnimationFrame(() => {
        if (!this.isConnected) return;
        const canvas =
          this.querySelector<HTMLElement>(':scope > .pele-canvas') ?? this;
        if (!canvas.querySelector(':scope > svg')) return;
        this.#enableWhenVisible(canvas);
      });
    }

    disconnectedCallback(): void {
      cancelAnimationFrame(this.#frame);
      this.#observer?.disconnect();
      this.#observer = undefined;
      this.#zoom?.destroy();
      this.#zoom = undefined;
    }

    #enableWhenVisible(canvas: HTMLElement): void {
      const tryEnable = (): boolean => {
        if (!this.isConnected || this.#zoom) return true;
        if (canvas.clientWidth <= 0) return false;
        this.#zoom = enableZoom(canvas, zoomOptions);
        this.#observer?.disconnect();
        this.#observer = undefined;
        return true;
      };

      if (tryEnable()) return;

      // Tabs/details start at display:none — wait for a non-zero width.
      const observer = new ResizeObserver(() => {
        tryEnable();
      });
      observer.observe(canvas);
      this.#observer = observer;
    }
  }

  customElements.define(tag, PeleDiagramElement);
}
