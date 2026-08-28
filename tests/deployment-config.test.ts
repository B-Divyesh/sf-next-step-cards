import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('ships versioned immutable assets and required static-host response policies', () => {
  const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8')) as {
    globalHeaders: Record<string, string>;
    mimeTypes: Record<string, string>;
    routes: Array<{ route: string; headers: Record<string, string> }>;
    responseOverrides: Record<string, { rewrite: string }>;
  };
  const index = readFileSync('index.html', 'utf8');
  const manifest = readFileSync('public/manifest.webmanifest', 'utf8');
  const worker = readFileSync('public/sw.js', 'utf8');
  const headersFor = (route: string) => config.routes.find((rule) => rule.route === route)?.headers;

  expect(index).toContain('hero-card-640.webp?v=1.0.7');
  expect(index).toContain('apple-touch-icon');
  expect(manifest).toContain('"start_url": "/?source=installed&v=1.0.7"');
  expect(worker).toContain("next-step-cards-shell-v1.0.7");
  expect(headersFor('/assets/*')?.['Cache-Control']).toBe('public, max-age=31536000, immutable');
  expect(headersFor('/icons/*')?.['Cache-Control']).toBe('public, max-age=31536000, immutable');
  expect(headersFor('/sw.js')?.['Cache-Control']).toBe('no-cache, no-store, must-revalidate');
  expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
  expect(config.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
  expect(config.globalHeaders['Permissions-Policy']).toContain('camera=()');
  expect(config.responseOverrides['404'].rewrite).toBe('/404.html');
});

test('redirects the legacy query demo before home metadata and ships complete raw demo metadata', () => {
  const home = readFileSync('index.html', 'utf8');
  const demo = readFileSync('demo/index.html', 'utf8');
  const description = 'Try a realistic sample card and history. Nothing is saved to your cards.';
  const redirect = "location.replace('/demo/')";

  expect(home).toContain('data-demo-redirect');
  expect(home).toContain("new URLSearchParams(location.search).get('demo') === '1'");
  expect(home.indexOf(redirect)).toBeGreaterThan(-1);
  expect(home.indexOf(redirect)).toBeLessThan(home.indexOf('<meta name="description"'));

  expect(demo).toContain('<title>Demo — Next Step Cards</title>');
  expect(demo).toContain(`<meta name="description" content="${description}"`);
  expect(demo).toContain(`<meta property="og:description" content="${description}"`);
  expect(demo).toContain(`<meta name="twitter:description" content="${description}"`);
  expect(demo).toContain('<link rel="canonical" href="https://next-step-cards.sociobot.in/demo/"');
});
