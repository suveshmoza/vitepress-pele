import { describe, expect, test } from 'vite-plus/test';

import { definePeleDiagram } from '../src/client.ts';

describe('definePeleDiagram', () => {
  test('no-ops when customElements is unavailable (SSR)', () => {
    const original = globalThis.customElements;
    // @ts-expect-error — simulate Node / VitePress SSR
    delete globalThis.customElements;

    expect(() => definePeleDiagram()).not.toThrow();

    globalThis.customElements = original;
  });
});
