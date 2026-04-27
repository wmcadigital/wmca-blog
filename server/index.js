const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');

const app = express();
const DIST_DIR = process.env.DIST_DIR || path.join(process.cwd(), 'dist');
const PORT = process.env.PORT || 3000;
const CMS_ITEM_ENDPOINT = process.env.CMS_ENDPOINT;
const API_KEY = process.env.REACT_APP_UMBRACO_API_KEY || process.env.UMBRACO_API_KEY || '';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const options = new URL(url);
    const req = https.request(options, { method: 'GET', headers: { 'Api-Key': API_KEY } }, (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function replaceHead(html, replacements) {
  const headClose = html.indexOf('</head>');
  if (headClose === -1) return html;
  let head = html.slice(0, headClose);
  const rest = html.slice(headClose);

  head = head.replace(/<title>[\s\S]*?<\/title>/i, '');
  head = head.replace(/<meta[^>]+name="description"[^>]*>/i, '');
  head = head.replace(/<meta[^>]+property="og:[^\"]+"[^>]*>/gi, '');
  head = head.replace(/<meta[^>]+name="twitter:[^\"]+"[^>]*>/gi, '');
  head = head.replace(/<link[^>]+rel="preload"[^>]*>/gi, '');

  const tags = [];
  tags.push(`<title>${replacements.title}</title>`);
  tags.push(`<meta name="description" content="${replacements.description}">`);
  tags.push(`<meta property="og:type" content="website">`);
  tags.push(`<meta property="og:title" content="${replacements.title}">`);
  tags.push(`<meta property="og:description" content="${replacements.description}">`);
  tags.push(`<meta property="og:url" content="${replacements.url}">`);
  if (replacements.image) tags.push(`<meta property="og:image" content="${replacements.image}">`);
  if (replacements.site_name) tags.push(`<meta property="og:site_name" content="${replacements.site_name}">`);
  tags.push(`<meta property="og:locale" content="en_GB">`);
  tags.push(`<meta name="twitter:card" content="summary_large_image">`);
  tags.push(`<meta name="twitter:title" content="${replacements.title}">`);
  tags.push(`<meta name="twitter:description" content="${replacements.description}">`);
  if (replacements.image) tags.push(`<meta name="twitter:image" content="${replacements.image}">`);

  head = head + '\n  ' + tags.join('\n  ');
  return head + rest;
}

// Serve static assets
app.use(express.static(DIST_DIR, { index: false }));

// Article route: render index.html with meta for crawlers and bots
app.get(['/article/:slug', '/article/:slug/*'], async (req, res) => {
  try {
    const slug = req.params.slug;
    // Build CMS URL similar to client getBlogArticle
    const cmsPath = encodeURIComponent(`/blog/${slug}`);
    const cmsUrl = `${CMS_ITEM_ENDPOINT}${cmsPath}?expand=properties%5Bauthor%5D&fields=properties%5B%24all%5D`;

    let article = null;
    try {
      article = await fetchJson(cmsUrl);
    } catch (e) {
      console.warn('Failed to fetch article from CMS:', e.message);
    }

    const indexHtmlPath = path.join(DIST_DIR, 'index.html');
    if (!fs.existsSync(indexHtmlPath)) {
      return res.status(500).send('index.html not found; run build first');
    }

    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

    const title = (article && article.name) || 'WMCA blog';
    const description = (article && article.properties && (article.properties.introduction || article.properties.summary || '')) || '';
    let image = null;
    try {
      if (article && article.properties && article.properties.image && article.properties.image[0]) {
        image = article.properties.image[0].url || null;
      }
    } catch (e) {
      // Ignore errors when accessing image properties
    }

    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    const outHtml = replaceHead(indexHtml, { title, description, image, url, site_name: 'WMCA' });
    res.set('Content-Type', 'text/html');
    res.send(outHtml);
  } catch (e) {
    console.error('SSR error:', e);
    res.status(500).send('Server error');
  }
});

// Fallback: serve index.html for all other routes so SPA works
app.get('*', (req, res) => {
  const indexHtmlPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) return res.status(500).send('index.html not found; run build first');
  res.sendFile(indexHtmlPath);
});

app.listen(PORT, () => {
  console.log(`SSR server listening on http://localhost:${PORT} (serving ${DIST_DIR})`);
});
