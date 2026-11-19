import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

const htmlPages = {
  main: path.resolve(__dirname, 'index.html'),
  couverture: path.resolve(__dirname, 'couverture/index.html'),
  toiture: path.resolve(__dirname, 'toiture/index.html'),
  zinguerie: path.resolve(__dirname, 'zinguerie/index.html'),
  charpente: path.resolve(__dirname, 'charpente/index.html'),
  etancheite: path.resolve(__dirname, 'etancheite/index.html'),
  desamiantage: path.resolve(__dirname, 'desamiantage/index.html'),
  contact: path.resolve(__dirname, 'contact/index.html'),
  mentionsLegales: path.resolve(__dirname, 'mentions-legales/index.html'),
  planDuSite: path.resolve(__dirname, 'plan-du-site/index.html'),
  notFound: path.resolve(__dirname, '404.html'),
};

export default defineConfig(() => {
  return {
    appType: 'mpa',
    plugins: [
      {
        name: 'static-mpa-dev-and-copy',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const urlPath = (req.url || '/').split('?')[0];
            if (
              urlPath === '/' ||
              urlPath.includes('.') ||
              urlPath.startsWith('/@') ||
              urlPath.startsWith('/node_modules')
            ) {
              return next();
            }
            const clean = urlPath.replace(/^\/+|\/+$/g, '');
            const candidate = path.resolve(__dirname, clean, 'index.html');
            if (fs.existsSync(candidate)) {
              if (!urlPath.endsWith('/')) {
                res.statusCode = 301;
                res.setHeader('Location', `/${clean}/`);
                res.end();
                return;
              }
              req.url = `/${clean}/index.html`;
              return next();
            }
            const notFoundFile = path.resolve(__dirname, '404.html');
            if (fs.existsSync(notFoundFile)) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.end(fs.readFileSync(notFoundFile, 'utf-8'));
              return;
            }
            return next();
          });
        },
        closeBundle(error?: Error): void {
          if (error) return;
          const distDir = path.resolve(__dirname, 'dist');
          if (!fs.existsSync(distDir)) return;

          const staticEntries = [
            'css',
            'js',
            'sitemap.xml',
            'robots.txt',
            'redirections.txt',
            'favicon.svg',
          ];
          for (const entry of staticEntries) {
            const src = path.resolve(__dirname, entry);
            const dest = path.resolve(distDir, entry);
            if (fs.existsSync(src)) {
              fs.cpSync(src, dest, {recursive: true, force: true});
            }
          }
        },
      },
    ],
    build: {
      rollupOptions: {
        input: htmlPages,
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
