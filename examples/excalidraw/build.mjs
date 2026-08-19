import { build } from 'esbuild';
await build({
  entryPoints: ['bundle-entry.jsx'],
  bundle: true, format: 'iife', outfile: 'vendor/excalidraw-bundle.js',
  loader: { '.woff2': 'file', '.ttf': 'file', '.css': 'css', '.svg': 'dataurl' },
  define: { 'process.env.NODE_ENV': '"production"', 'process.env.IS_PREACT': '"false"' },
  assetNames: '[name]', minify: true, logLevel: 'error', conditions: ['production'],
});
console.log('bundled');
