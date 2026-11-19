import type { Env, Token } from 'markdown-it';

export function idPrefixFor(env: Env | undefined, token: Token): string {
  return `pele-${hash36(pathFromEnv(env))}-${token.map?.[0] ?? 0}`;
}

/**
 * Page path from markdown-it `env`.
 *
 * Prefers VitePress `relativePath`, then `path`. Returns `''` when neither is a
 * string.
 */
export function pathFromEnv(env: Env | undefined): string {
  if (!env) return '';
  const relativePath = env['relativePath'];
  if (typeof relativePath === 'string') return relativePath;
  const path = env['path'];
  if (typeof path === 'string') return path;
  return '';
}

function hash36(value: string): string {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}
