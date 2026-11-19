# Changelog

## 0.0.1

Initial release.

### Added

- `peleMarkdown()` — markdown-it plugin that turns Mermaid fences into Pele SVG diagrams at build time 
- `definePeleDiagram()` — registers `<pele-diagram>` for client-side zoom
- `vitepress-pele/style.css` — VitePress-themed Pele styles
- Options: `maxWidth`, `languages`, `render`, `onError`, `source`, `className`
- `PeleMarkdownError` when `onError` is `'throw'` (default)
