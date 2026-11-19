# Structure

## Class

```mermaid
---
title: Plugin surface
---
classDiagram
  note "Public exports"
  PeleMarkdownOptions <|-- ResolvedOptions : defaults applied
  note for PeleMarkdownOptions "maxWidth, languages, onError"
  PeleMarkdownOptions --> peleMarkdown : configures
  DefinePeleDiagramOptions --> definePeleDiagram : configures
  peleMarkdown : +(md) install fence rule
  definePeleDiagram : +register CE
  definePeleDiagram : +enableZoom
  class PeleMarkdownOptions {
    +number maxWidth
    +string[] languages
    +onError throw|render
  }
  class DefinePeleDiagramOptions {
    +string tag
    +object zoom
  }
```

## Entity relationship

```mermaid
erDiagram
  PACKAGE ||--o{ EXPORT : ships
  PACKAGE {
    string name PK
    string version
    string license
  }
  EXPORT ||--|| ENTRY : resolves
  EXPORT {
    string path PK
    string types
    string import
  }
  SITE ||--o{ PAGE : contains
  SITE {
    string title PK
    string base
  }
  PAGE {
    string route PK, FK
    string title
    boolean hasDiagram
  }
  PACKAGE only one to zero or more SITE : documents
```

## State

```mermaid
---
config:
  theme: default
  look: classic
  layout: dagre
---
stateDiagram-v2
  [*] --> Source
  Source --> Packed : vp pack
  state Docs {
    [*] --> DevServer
    DevServer --> Built
  }
  Packed --> Docs
  Docs --> Published : deploy
  Published --> [*]
```

## Nested parallel states

```mermaid
stateDiagram-v2
  [*] --> Workspace
  state Workspace {
    [*] --> LibIdle
    LibIdle --> LibWatch : pack --watch
    LibWatch --> LibIdle : rebuild done
    --
    [*] --> DocsIdle
    DocsIdle --> DocsDev : docs#dev
    DocsDev --> DocsIdle : stop
  }
```

## C4 component

```mermaid
C4Component
title Component diagram for a VitePress docs site with Pele

Container(browser, "Reader browser", "HTML/CSS/JS", "Loads the static docs site and optional Pele zoom.")
Container(ci, "CI runner", "GitHub Actions", "Builds and deploys the docs on each push.")
ContainerDb(cdn, "Static host", "Object storage / CDN", "Serves the built HTML, assets, and inline SVG.")
System_Ext(npm, "npm registry", "Hosts the published vitepress-pele package.")

Container_Boundary(docs, "Docs app") {
  Component(vp, "VitePress", "Static site generator", "Parses markdown and builds pages.")
  Component(plugin, "vitepress-pele", "markdown-it plugin", "Turns mermaid fences into Pele SVG at build time.")
  Component(theme, "Theme enhanceApp", "Vue theme hook", "Registers pele-diagram and enables zoom.")
  Component(pele, "Pele", "Diagram renderer", "Layouts Mermaid into SVG.")

  Rel(vp, plugin, "md.use")
  Rel(plugin, pele, "render")
  Rel(theme, plugin, "imports client + CSS")
}

Rel_Back(browser, theme, "Loads", "HTTPS")
Rel(browser, cdn, "Fetches pages", "HTTPS")
Rel(ci, docs, "vp run docs#build")
Rel(ci, cdn, "Uploads dist")
Rel(docs, npm, "workspace / published package")
```
