# Web Component Quick Reference

Fast lookup guide for common tasks.

## Basic Element

```html
<wmca-blog app-url="https://blog.example.com"></wmca-blog>
<script src="https://cdn.example.com/wmca-blog-component.js"></script>
```

---

## HTML Attributes

| Attribute | Type | Default | Example |
|-----------|------|---------|---------|
| `app-url` | URL | `http://localhost:3000` | `app-url="https://blog.example.com"` |
| `height` | CSS Height | `800px` | `height="900px"` |
| `theme` | `light` \| `dark` | `light` | `theme="dark"` |
| `data-api-key` | String | (none) | `data-api-key="abc123"` |

---

## JavaScript API

### Get Reference

```javascript
const blog = document.querySelector('wmca-blog');
const blog = document.getElementById('my-blog');
const allBlogs = document.querySelectorAll('wmca-blog');
```

### Methods

```javascript
blog.reload();                      // Reload content
blog.navigateToArticle('title');   // Go to article
blog.navigateToAuthor('Name');     // Go to author
```

### Properties

```javascript
blog.iframeElement                  // HTMLIFrameElement
blog.getAttribute('app-url');       // Get attribute
blog.setAttribute('height', '500px'); // Change attribute
```

---

## Common Patterns

### Get Component Reference

```javascript
const blog = document.querySelector('wmca-blog') || 
             document.getElementById('blog');
```

### Check if Registered

```javascript
console.log(customElements.get('wmca-blog')); // true or null
```

### Navigate on Button Click

```javascript
doc.getElementById('read-btn').addEventListener('click', () => {
  document.querySelector('wmca-blog').navigateToArticle('article-title');
});
```

### Reload on Demand

```javascript
setTimeout(() => {
  document.querySelector('wmca-blog').reload();
}, 5000); // Wait 5 seconds then reload
```

### Check if Article Exists

```javascript
const blog = document.querySelector('wmca-blog');
// Try to navigate - if article doesn't exist, will show 404
blog.navigateToArticle('try-this-article');
```

---

## HTML Examples

### Basic

```html
<wmca-blog app-url="https://blog.example.com"></wmca-blog>
<script src="https://cdn.example.com/wmca-blog-component.js"></script>
```

### Custom Height

```html
<wmca-blog app-url="https://blog.example.com" height="600px"></wmca-blog>
<script src="..."></script>
```

### Dark Theme

```html
<wmca-blog 
  app-url="https://blog.example.com" 
  theme="dark"
  height="800px">
</wmca-blog>
<script src="..."></script>
```

### Multiple Instances

```html
<wmca-blog id="featured" app-url="https://blog.example.com"></wmca-blog>
<wmca-blog id="sidebar" app-url="https://blog.example.com" height="400px"></wmca-blog>
<script src="..."></script>
```

### With API Key

```html
<wmca-blog 
  app-url="https://blog.example.com"
  data-api-key="your-key-here">
</wmca-blog>
<script src="..."></script>
```

---

## CSS Snippets

### Basic Styling

```css
wmca-blog {
  margin: 2rem 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

### Responsive

```css
wmca-blog {
  height: 800px;
}

@media (max-width: 768px) {
  wmca-blog {
    height: 600px;
  }
}
```

### Theme

```css
wmca-blog {
  --wmca-blog-bg: #f5f5f5;
  --wmca-blog-text: #333;
}
```

### Dark Mode

```css
body.dark wmca-blog {
  --wmca-blog-bg: #1a1a1a;
  --wmca-blog-text: #ffffff;
}
```

---

## Umbraco Template

```cshtml
<wmca-blog 
  app-url="@Model.Value<string>("blogUrl")"
  height="900px"
  theme="light">
</wmca-blog>

<script src="@Model.Value<string>("componentUrl")"></script>

<script>
  const blog = document.querySelector('wmca-blog');
  document.querySelectorAll('[data-article]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      blog.navigateToArticle(link.dataset.article);
    });
  });
</script>
```

---

## React Integration

### Simple

```jsx
export function Blog() {
  return <wmca-blog app-url="https://blog.example.com" />;
}
```

### With Control

```jsx
export function Blog() {
  const ref = useRef(null);

  const navigate = (title) => {
    if (ref.current?.navigateToArticle) {
      ref.current.navigateToArticle(title);
    }
  };

  return (
    <>
      <wmca-blog ref={ref} app-url="https://blog.example.com" />
      <button onClick={() => navigate('hello')}>Read Blog</button>
    </>
  );
}
```

---

## Vue Integration

### Simple

```vue
<template>
  <wmca-blog app-url="https://blog.example.com" />
</template>

<script>
  export default {
    mounted() {
      if (!customElements.get('wmca-blog')) {
        // Load script if needed
      }
    }
  }
</script>
```

### With Control

```vue
<template>
  <wmca-blog ref="blog" app-url="https://blog.example.com" />
  <button @click="navigate">Read Article</button>
</template>

<script>
  export default {
    methods: {
      navigate() {
        this.$refs.blog.navigateToArticle('hello');
      }
    }
  }
</script>
```

---

## Deployment

### Build Component

```bash
npm run web-component:build
# Output: web-component-dist/wmca-blog-component.js
```

### Build & Deploy App

```bash
npm run next:build
npm run next:start
# Then deploy to Vercel, Azure, etc.
```

### Vercel

```bash
npm install -g vercel
vercel deploy
```

### Azure

```bash
az webapp create --name blog-app --resource-group mygroup --runtime "node|18-lts"
az webapp deployment source config-zip --resource-group mygroup --name blog-app --src app.zip
```

---

## Environment Variables

### .env File

```env
UMBRACO_API_KEY=your-key
NEXT_PUBLIC_BLOG_URL=https://blog.example.com
REACT_APP_UMBRACO_API_KEY=your-key
```

### Vercel Dashboard

```
UMBRACO_API_KEY=your-key
NEXT_PUBLIC_BLOG_URL=https://blog.example.com
```

---

## Troubleshooting Commands

### Browser Console

```javascript
// Check if registered
customElements.get('wmca-blog')

// Find element
document.querySelector('wmca-blog')

// Check app URL
document.querySelector('wmca-blog').getAttribute('app-url')

// Check iframe
document.querySelector('wmca-blog').iframeElement?.src

// Reload
document.querySelector('wmca-blog').reload()

// Navigate
document.querySelector('wmca-blog').navigateToArticle('title')
```

### Terminal

```bash
# Test app is running
curl https://blog.example.com

# Test component script
curl https://cdn.example.com/wmca-blog-component.js

# Check file exists
ls -la web-component-dist/wmca-blog-component.js
```

---

## CORS Configuration

### Next.js

```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://umbraco.example.com',
          },
        ],
      },
    ];
  },
};
```

### Umbraco

```json
{
  "Umbraco": {
    "Cms": {
      "Global": {
        "AllowCorsOrigins": ["https://blog.example.com"]
      }
    }
  }
}
```

---

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| **Blank Component** | App not running/accessible | Check app URL, verify `npm run next:start` |
| **Script 404** | CDN URL wrong | Verify CDN path, check file exists |
| **CORS blocked** | Cross-origin request | Configure CORS in Next.js/server |
| **Navigation fails** | Article doesn't exist | Check article title/URL format |
| **Styling issues** | Shadow DOM isolation | Use CSS custom properties or host styling |
| **Slow loading** | Script not defer | Add `defer` or `async` to script tag |

---

## Quick Links

- **Full Docs**: [WEB-COMPONENT-README.md](./docs/WEB-COMPONENT-README.md)
- **Deploy Guide**: [DEPLOYMENT-GUIDE.md](./docs/DEPLOYMENT-GUIDE.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
- **Demo**: [demo.html](./demo.html)
- **Umbraco Example**: [umbraco-template-example.cshtml](./docs/umbraco-template-example.cshtml)

---

## Build Scripts

```bash
npm run next:dev           # Run locally
npm run next:build         # Build for production
npm run next:start         # Start production server
npm run web-component:build # Build web component
npm run lhci:collect       # Performance report
npm test                   # Run tests
```

---

## File Locations

```
src/WebComponent.js              ← Component source
web-component-dist/              ← Built component (output)
docs/WEB-COMPONENT-README.md     ← Full documentation
docs/DEPLOYMENT-GUIDE.md         ← Deploy instructions
docs/TROUBLESHOOTING.md          ← Common issues
demo.html                        ← Interactive demo
```

---

**Print this page** (Ctrl+P) for a physical reference while developing!

Last Updated: March 2024
