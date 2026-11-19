# Options

## `peleMarkdown(options?)`

Turns matching fences into Pele SVG during the VitePress build.

| Option      | Default          | Description                                                                             |
| ----------- | ---------------- | --------------------------------------------------------------------------------------- |
| `maxWidth`  | `688`            | Max diagram width in CSS pixels. Raise this for wide diagrams (C4, sankey, git).        |
| `languages` | `['mermaid']`    | Fence languages to render.                                                              |
| `render`    | `{}`             | Extra Pele render options. The plugin sets `idPrefix`, `maxWidth`, and `responsive`.    |
| `onError`   | `'throw'`        | `'throw'` raises `PeleMarkdownError`. `'render'` emits an HTML error block.             |
| `source`    | `false`          | When `true`, sets `data-pele-source` on `<pele-diagram>` to the URL-encoded fence body. |
| `className` | `'pele-diagram'` | Class on `<pele-diagram>`.                                                              |

```ts
import { peleMarkdown } from 'vitepress-pele';

md.use(
  peleMarkdown({
    maxWidth: 900,
    onError: 'render',
  }),
);
```

Use `onError: 'render'` in docs sites when you prefer a visible error block over a failed build.

## `definePeleDiagram(options?)`

Registers the custom element and Pele zoom in the browser.

| Option | Default          | Description                                                             |
| ------ | ---------------- | ----------------------------------------------------------------------- |
| `tag`  | `'pele-diagram'` | Custom element tag to register.                                         |
| `zoom` | Pele defaults    | Passed to Pele zoom. Zoom runs only when the diagram was shrunk to fit. |

```ts
import { definePeleDiagram } from 'vitepress-pele/client';

definePeleDiagram({
  zoom: {
    // Pele zoom options — see https://pele.run/
  },
});
```
