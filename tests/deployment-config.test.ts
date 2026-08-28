import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('ships versioned immutable assets and required static-host response policies', () => {
  const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8')) as {
    globalHeaders: Record<string, string>;
    mimeTypes: Record<string, string>;
    routes: Array<{ route: string; headers: Record<string, string> }>;
  };
  const index = readFileSync('index.html', 'utf8');
  const manifest = readFileSync('public/manifest.webmanifest', 'utf8');
  const worker = readFileSync('public/sw.js', 'utf8');
  const headersFor = (route: string) => config.routes.find((rule) => rule.route === route)?.headers;

  expect(index).toContain('hero-card-640.webp?v=1.0.2');
  expect(manifest).toContain('"start_url": "/?source=installed&v=1.0.2"');
  expect(worker).toContain("next-step-cards-shell-v1.0.2");
  expect(headersFor('/assets/*')?.['Cache-Control']).toBe('public, max-age=31536000, immutable');
  expect(headersFor('/icons/*')?.['Cache-Control']).toBe('public, max-age=31536000, immutable');
  expect(headersFor('/sw.js')?.['Cache-Control']).toBe('no-cache, no-store, must-revalidate');
  expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
  expect(config.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
  expect(config.globalHeaders['Permissions-Policy']).toContain('camera=()');
});
