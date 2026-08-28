import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

function inlineAppShell(): Plugin {
  return {
    name: 'inline-offline-app-shell',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const script = Object.entries(bundle).find(([fileName, output]) => fileName.startsWith('assets/app') && output.type === 'chunk')?.[1];
      const style = bundle['assets/style.css'];
      if (script?.type !== 'chunk' || style?.type !== 'asset') return;
      for (const [fileName, output] of Object.entries(bundle)) {
        if (output.type !== 'asset' || !fileName.endsWith('.html')) continue;
        output.source = output.source.toString().replace(/<link rel="stylesheet"[^>]*href="\/assets\/style\.css"[^>]*>/, `<style>${style.source.toString()}</style>`);
        if (fileName === 'index.html' || fileName === 'demo/index.html') output.source = output.source.toString().replace(/<script type="module"[^>]*src="\/assets\/app[^\"]*\.js"><\/script>/, `<script type="module">${script.code}</script>`);
      }
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
    modulePreload: false,
    sourcemap: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        app: resolve(import.meta.dirname, 'index.html'),
        demo: resolve(import.meta.dirname, 'demo/index.html'),
        privacy: resolve(import.meta.dirname, 'privacy/index.html'),
        terms: resolve(import.meta.dirname, 'terms/index.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (asset) => asset.names.some((name) => name.endsWith('.css')) ? 'assets/style.css' : 'assets/[name][extname]',
      },
    },
  },
});
