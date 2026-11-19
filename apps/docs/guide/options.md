# Options

## `peleMarkdown(options?)`

Configures the markdown-it plugin that turns Mermaid fences into Pele SVG at build time.

| Option      | Default          | Description                                                                                |
| ----------- | ---------------- | ------------------------------------------------------------------------------------------ |
| `maxWidth`  | `688`            | Max diagram width in CSS pixels                                                            |
| `languages` | `['mermaid']`    | Fence languages to render                                                                  |
| `render`    | `{}`             | Extra Pele render options (`idPrefix`, `maxWidth`, and `responsive` are set by the plugin) |
| `onError`   | `'throw'`        | `'throw'` raises `PeleMarkdownError`; `'render'` emits an HTML error block                 |
| `source`    | `false`          | When `true`, sets `data-pele-source` on `<pele-diagram>`                                   |
| `className` | `'pele-diagram'` | Class on `<pele-diagram>`                                                                  |

### Example

```ts
import { peleMarkdown } from 'vitepress-pele';

md.use(
  peleMarkdown({
    maxWidth: 800,
    onError: 'render',
    source: true,
  }),
);
```

## `definePeleDiagram(options?)`

Registers the `<pele-diagram>` custom element and enables Pele zoom in the browser.

| Option | Default          | Description                                                            |
| ------ | ---------------- | ---------------------------------------------------------------------- |
| `tag`  | `'pele-diagram'` | Custom element tag to register                                         |
| `zoom` | Pele defaults    | Pele zoom options (zoom is enabled when the diagram was shrunk to fit) |

### Example

```ts
import { definePeleDiagram } from 'vitepress-pele/client';

definePeleDiagram({
  zoom: {
    // Pele zoom options
  },
});
```

`definePeleDiagram()` is a no-op during VitePress SSR when `customElements` is unavailable.
