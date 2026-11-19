import MarkdownIt from 'markdown-it';
import type { Token } from 'markdown-it';
import { describe, expect, test } from 'vite-plus/test';

import { idPrefixFor } from '../src/ids.ts';
import { PeleMarkdownError, peleMarkdown } from '../src/index.ts';

function createMd(
  options?: Parameters<typeof peleMarkdown>[0],
): InstanceType<typeof MarkdownIt> {
  const md = new MarkdownIt();
  md.use(peleMarkdown(options));
  return md;
}

function tokenAt(map: [number, number]): Token {
  const token = new MarkdownIt.Token('fence', 'code', 0);
  token.map = map;
  return token;
}

describe('peleMarkdown', () => {
  test('renders mermaid fences as pele-diagram figures', () => {
    const html = createMd().render(
      '```mermaid\nflowchart LR\n  A --> B\n```\n',
      {
        relativePath: 'guide/flow.md',
      },
    );

    expect(html).toContain('<figure class="pele-figure" v-pre>');
    expect(html).toContain('<pele-diagram');
    expect(html).toContain('class="pele-diagram"');
    expect(html).toContain('data-pele-type="flowchart"');
    expect(html).toContain('<div class="pele-canvas">');
    expect(html).toContain('<svg');
    expect(html).toContain('max-width:100%');
    expect(html).not.toContain('data-pele-source');
  });

  test('leaves non-target fences alone', () => {
    const html = createMd().render('```js\nconsole.log(1)\n```\n');
    expect(html).toContain('<pre');
    expect(html).toContain('console.log(1)');
    expect(html).not.toContain('pele-diagram');
  });

  test('embeds source when source: true', () => {
    const source = 'flowchart LR\n  A --> B\n';
    const html = createMd({ source: true }).render(
      `\`\`\`mermaid\n${source}\`\`\`\n`,
    );
    expect(html).toContain(`data-pele-source="${encodeURIComponent(source)}"`);
  });

  test('uses custom className', () => {
    const html = createMd({ className: 'diagram' }).render(
      '```mermaid\nflowchart LR\n  A --> B\n```\n',
    );
    expect(html).toContain('class="diagram"');
  });

  test('throws PeleMarkdownError by default on syntax errors', () => {
    const md = createMd();
    expect(() =>
      md.render('```mermaid\nflowchart LR\n  A --> \n```\n', {
        relativePath: 'guide/flow.md',
      }),
    ).toThrow(PeleMarkdownError);

    try {
      md.render('```mermaid\nflowchart LR\n  A --> \n```\n', {
        relativePath: 'guide/flow.md',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(PeleMarkdownError);
      expect(String(error)).toContain(
        '[vitepress-pele] syntax error in guide/flow.md:',
      );
      expect(String(error)).toContain('column');
    }
  });

  test('emits an error block when onError is render', () => {
    const html = createMd({ onError: 'render' }).render(
      '```mermaid\nflowchart LR\n  A --> \n```\n',
      { relativePath: 'guide/flow.md' },
    );
    expect(html).toContain('class="pele-error"');
    expect(html).toContain('role="alert"');
    expect(html).toContain('Diagram failed to render');
    expect(html).toContain('syntax error');
  });

  test('respects custom languages list', () => {
    const md = createMd({ languages: ['pele'] });
    const skipped = md.render('```mermaid\nflowchart LR\n  A --> B\n```\n');
    expect(skipped).toContain('<pre');
    expect(skipped).not.toContain('pele-diagram');

    const rendered = md.render('```pele\nflowchart LR\n  A --> B\n```\n');
    expect(rendered).toContain('pele-diagram');
  });
});

describe('idPrefixFor', () => {
  test('is stable for the same path and fence line', () => {
    const a = idPrefixFor({ relativePath: 'guide/a.md' }, tokenAt([10, 14]));
    const b = idPrefixFor({ relativePath: 'guide/a.md' }, tokenAt([10, 14]));
    expect(a).toBe(b);
    expect(a).toMatch(/^pele-[a-z0-9]+-10$/);
  });

  test('differs when the same diagram appears twice on one page', () => {
    const first = idPrefixFor(
      { relativePath: 'guide/a.md' },
      tokenAt([10, 14]),
    );
    const second = idPrefixFor(
      { relativePath: 'guide/a.md' },
      tokenAt([20, 24]),
    );
    expect(first).not.toBe(second);
  });
});
