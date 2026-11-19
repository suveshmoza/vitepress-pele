# Live diagrams

These pages use the local `vitepress-pele` workspace package. Diagrams are SVG at build time; zoom is available when a diagram is scaled to fit.

## Flowchart

```mermaid
flowchart LR
  Install --> Config
  Config --> Theme
  Theme --> Diagrams
```

## Sequence

```mermaid
sequenceDiagram
  participant Author
  participant VitePress
  participant Pele

  Author->>VitePress: Write mermaid fence
  VitePress->>Pele: Render SVG at build time
  Pele-->>VitePress: Inline SVG
  VitePress-->>Author: Static page with diagram
```

## Class diagram

```mermaid
classDiagram
  class PeleMarkdownOptions {
    +number maxWidth
    +string[] languages
    +object render
    +string onError
    +boolean source
    +string className
  }
  class DefinePeleDiagramOptions {
    +string tag
    +object zoom
  }
  PeleMarkdownOptions --> DefinePeleDiagramOptions : pairs with
```

## State diagram

```mermaid
stateDiagram-v2
  [*] --> Draft
  Draft --> Built: vitepress build
  Built --> Published: deploy
  Published --> [*]
```
