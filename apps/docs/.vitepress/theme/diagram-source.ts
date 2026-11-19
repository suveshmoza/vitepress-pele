import type { EnhanceAppContext } from 'vitepress';

const SOURCE_CLASS = 'pele-source';

function attachDiagramSources(root: ParentNode = document): void {
  for (const diagram of root.querySelectorAll(
    'pele-diagram[data-pele-source]',
  )) {
    const encoded = diagram.getAttribute('data-pele-source');
    if (!encoded) {
      continue;
    }

    const figure = diagram.closest('figure.pele-figure');
    if (!(figure instanceof HTMLElement)) {
      continue;
    }
    if (figure.nextElementSibling?.classList.contains(SOURCE_CLASS)) {
      continue;
    }

    let body: string;
    try {
      body = decodeURIComponent(encoded).replace(/\n$/, '');
    } catch {
      continue;
    }

    const details = document.createElement('details');
    details.className = SOURCE_CLASS;

    const summary = document.createElement('summary');
    summary.textContent = 'View markdown';

    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.className = 'language-md';
    code.textContent = `\`\`\`mermaid\n${body}\n\`\`\``;
    pre.append(code);

    details.append(summary, pre);
    figure.after(details);
  }
}

/** After each VitePress navigation, attach “View markdown” under diagrams. */
export function enhanceAppWithDiagramSources({
  router,
}: EnhanceAppContext): void {
  if (import.meta.env.SSR) {
    return;
  }

  const schedule = (): void => {
    requestAnimationFrame(() => {
      attachDiagramSources();
    });
  };

  schedule();

  const previous = router.onAfterRouteChange;
  router.onAfterRouteChange = (to: string) => {
    previous?.(to);
    schedule();
  };
}
