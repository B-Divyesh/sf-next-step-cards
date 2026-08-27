import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

function inlineAppShell(): Plugin {
  return {
    name: 'inline-offline-app-shell',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const html = bundle['index.html'];
      const script = bundle['assets/app.js'];
      const style = bundle['assets/style.css'];
      if (html?.type !== 'asset' || script?.type !== 'chunk' || style?.type !== 'asset') return;
      html.source = html.source.toString()
        .replace(/<script type="module"[^>]*src="\/assets\/app\.js"><\/script>/, `<script type="module">${script.code}</script>`)
        .replace(/<link rel="stylesheet"[^>]*href="\/assets\/style\.css"[^>]*>/, `<style>${style.source.toString()}</style>`);
    },
  };
}

export default defineConfig({
  plugins: [{
    name: 'same-origin-static-assets',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replaceAll(' crossorigin', '');
    },
  }, inlineAppShell()],
  build: {
    target: 'es2022',
    sourcemap: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        app: resolve(import.meta.dirname, 'index.html'),
        privacy: resolve(import.meta.dirname, 'privacy/index.html'),
        terms: resolve(import.meta.dirname, 'terms/index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (asset) => asset.names.some((name) => name.endsWith('.css')) ? 'assets/style.css' : 'assets/[name][extname]',
      },
    },
  },
});
