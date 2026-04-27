# Converting Next.js Blog to Web Component

This guide explains how your Next.js blog application has been converted into a web component for Umbraco integration.

## What is a Web Component?

A web component is a reusable, custom HTML element that can be embedded anywhere:

```html
<wmca-blog app-url="https://blog.example.com"></wmca-blog>
```

Instead of deploying your entire Next.js app on Umbraco's server, the web component:
1. Loads your Next.js app from a separate deployment (Vercel, Azure, etc.)
2. Embeds it in an iframe with sandbox security
3. Provides programmatic control via JavaScript API

## Architecture

```
┌─────────────────────────────────────────────────┐
│         Umbraco CMS                             │
│  ┌────────────────────────────────────────┐    │
│  │  Template/Page with:                   │    │
│  │  <wmca-blog app-url="..."/>            │    │
│  │  <script src="web-component.js"/>      │    │
│  │                                        │    │
│  │  Web Component loads →                 │    │
│  └────────────┬─────────────────────────┘│    │
│               │                           │    │
└───────────────┼───────────────────────────┘    │
                │                                 │
                ↓                                 │
        ┌───────────────────────────┐            │
        │  Next.js Blog App        │            │
        │ (Vercel/Azure/etc)       │            │
        │                           │            │
        │ - Pages (articles)        │            │
        │ - API routes              │            │
        │ - Umbraco integration     │            │
        └───────────────────────────┘            │
```

## Files Created

### Core Web Component Files

- **[src/WebComponent.js](../src/WebComponent.js)** - The custom element that handles embedding
- **[scripts/build-web-component.js](../scripts/build-web-component.js)** - Build script to create standalone bundle

### Documentation

- **[docs/WEB-COMPONENT-INTEGRATION.md](../docs/WEB-COMPONENT-INTEGRATION.md)** - Complete integration guide
- **[docs/umbraco-template-example.cshtml](../docs/umbraco-template-example.cshtml)** - Umbraco template example
- **[web-component-example.html](../web-component-example.html)** - Standalone HTML test page

### Configuration

- **[next.config.js](../next.config.js)** - Updated Next.js config for standalone builds
- **[package.json](../package.json)** - Added `web-component:build` script

## How It Works

### 1. Next.js App Builds Standalone

The Next.js app builds with `output: 'standalone'` in [next.config.js](../next.config.js), allowing it to run independently:

```bash
npm run next:build
npm run next:start
```

### 2. Web Component Script Created

The [WebComponent.js](../src/WebComponent.js) creates a custom `<wmca-blog>` element:

```javascript
class WmcaBlogComponent extends HTMLElement {
  connectedCallback() {
    // Creates an iframe pointing to the deployed Next.js app
    // Handles navigation, theming, sizing
  }
}

customElements.define('wmca-blog', WmcaBlogComponent);
```

### 3. Build Web Component Bundle

```bash
npm run web-component:build
```

Creates: `web-component-dist/wmca-blog-component.js` (single file bundle)

### 4. Deploy

1. **Next.js App**: Deploy to Vercel, Azure, or any Node.js host
   ```bash
   npm run next:build && npm run next:start
   ```

2. **Web Component Script**: Upload to CDN
   ```
   https://your-cdn.com/wmca-blog-component.js
   ```

3. **Umbraco Template**: Add the custom element
   ```html
   <wmca-blog app-url="https://your-blog.vercel.app"></wmca-blog>
   <script src="https://your-cdn.com/wmca-blog-component.js"></script>
   ```

## Quick Start

### Development

Test the web component locally:

1. **Terminal 1**: Run the Next.js app
   ```bash
   npm run next:dev
   # App runs on http://localhost:3000
   ```

2. **Terminal 2**: Serve the example HTML
   ```bash
   npx http-server
   # Open http://localhost:8080/web-component-example.html
   ```

### Production

1. Build and deploy Next.js app
   ```bash
   npm run next:build
   # Deploy to Vercel or your hosting
   ```

2. Build web component
   ```bash
   npm run web-component:build
   # Output: web-component-dist/wmca-blog-component.js
   ```

3. Upload both to their respective locations

4. Use in Umbraco template (see [umbraco-template-example.cshtml](../docs/umbraco-template-example.cshtml))

## Component API

### HTML Attributes

```html
<wmca-blog 
  app-url="https://blog.example.com"
  height="800px"
  theme="light"
  data-api-key="your-key">
</wmca-blog>
```

### JavaScript Methods

```javascript
const blog = document.querySelector('wmca-blog');

// Reload the component
blog.reload();

// Navigate to article
blog.navigateToArticle('article-title');

// Navigate to author
blog.navigateToAuthor('Author Name');
```

## Security Features

- **Shadow DOM**: Encapsulated styling prevents CSS leaks
- **Iframe Sandbox**: Restricts cross-origin access
- **Environment Variables**: API keys stored securely on server
- **CORS**: Configured for your specific domains

## Troubleshooting

### Component not showing?

```javascript
// Check if registered
console.log(customElements.get('wmca-blog'));

// Check iframe src
console.log(document.querySelector('wmca-blog').iframeElement.src);
```

### Styling issues?

Use CSS custom properties:

```css
wmca-blog {
  --wmca-blog-bg: #ffffff;
  --wmca-blog-text: #000000;
}
```

### CORS errors?

Ensure your Next.js app's CORS headers allow the Umbraco domain:

```javascript
// In pages/_document.js or next.config.js
headers: [
  {
    source: '/api/:path*',
    headers: [
      {
        key: 'Access-Control-Allow-Origin',
        value: 'https://umbraco.example.com',
      },
    ],
  },
]
```

## Next Steps

1. ✅ Web component created
2. ⏳ Deploy Next.js app to production
3. ⏳ Build web component bundle
4. ⏳ Upload to CDN
5. ⏳ Integrate into Umbraco templates
6. ⏳ Test in staging environment
7. ⏳ Deploy to production

See [WEB-COMPONENT-INTEGRATION.md](../docs/WEB-COMPONENT-INTEGRATION.md) for detailed integration steps.
