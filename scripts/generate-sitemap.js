#!/usr/bin/env node
/*
  Simple sitemap generator for this project.
  - Fetches articles from the CMS endpoint used in src/api/getBlogArticles.js
  - Produces sitemap.xml at the repository root (or at --out argument)

  Usage:
    node scripts/generate-sitemap.js
    npm run sitemap

  Note: Update BASE_URL if your site is hosted elsewhere.
*/

const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = process.env.SITE_BASE_URL || 'https://www.wmca.org.uk';
const CMS_ENDPOINT = 'https://cms.wmca.org.uk/umbraco/delivery/api/v2/content?filter=contentType%3AblogArticle&sort=name%3Aasc&skip=0&take=500';
const OUT_PATH = process.env.OUT_PATH || path.join(process.cwd(), 'sitemap.xml');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(raw));
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', reject);
  });
}

(async function main() {
  try {
    console.log('Fetching articles...');
    const data = await fetchJson(CMS_ENDPOINT);
    const items = data.items || [];

    // Helper to build article path - this project uses /article/:articleTitle
    // The `route.path` in components seems to include the article slug already when used.

    const urls = new Set();

    // Add homepage
    urls.add(BASE_URL + '/');

    // Add article pages
    items.forEach((item) => {
      // try to find route path in item.route.path or construct from name
      const routePath = item.route && item.route.path;
      if (routePath) {
        // ensure it is prefixed with /article/
        const articleUrl = routePath.startsWith('/') ? routePath : '/' + routePath;
        urls.add(BASE_URL + articleUrl);
      } else if (item.name) {
        // fallback: slugify name
        const slug = item.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        urls.add(`${BASE_URL}/article/${slug}`);
      }
    });

    const header = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    const xmlStart = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    const xmlEnd = `</urlset>`;

    const body = Array.from(urls)
      .map((u) => {
        return `  <url>\n    <loc>${u}</loc>\n  </url>`;
      })
      .join('\n');

    const sitemap = header + xmlStart + body + '\n' + xmlEnd;

    fs.writeFileSync(OUT_PATH, sitemap, 'utf8');
    console.log('Sitemap written to', OUT_PATH);
  } catch (err) {
    console.error('Failed to generate sitemap:', err);
    process.exitCode = 1;
  }
})();
