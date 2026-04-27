# Web Component Documentation

Complete guide for using the WMCA Blog Web Component.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Configuration](#configuration)
6. [API Reference](#api-reference)
7. [Styling & Theming](#styling--theming)
8. [Security](#security)
9. [Troubleshooting](#troubleshooting)
10. [Examples](#examples)

---

## Overview

- **Zero Configuration Required** - Works out of the box with sensible defaults
- **Responsive** - Works on all screen sizes and devices
- **Theme Support** - Light and dark mode variants

### Architecture

```
┌──────────────────────────┐
│   Your Website (CMS)     │
│  ┌────────────────────┐  │
│  │ <wmca-blog />      │  │
│  │ Web Component      │  │
│  └─────────┬──────────┘  │
└────────────┼─────────────┘
             │
             └→ http://your-blog.vercel.app
                 (Separate Next.js deployment)
```

---
### Consuming Breadcrumbs Inside The Embedded App

When the web component injects breadcrumbs they are written to the iframe's global `window.setTopics` object with this shape:

```js
window.setTopics = {
  topics: [...],
  breadcrumbs: { breadcrumb: ['Home', 'Section', 'Subsection'] }
}
```

In your Next.js/React app, read this safely (SSR-aware) and provide a sensible fallback:

```jsx
import { useEffect, useState } from 'react';

function Breadcrumbs() {
  const [crumbs, setCrumbs] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const injected = window.setTopics?.breadcrumbs?.breadcrumb;
      if (Array.isArray(injected)) setCrumbs(injected);
    }
  }, []);

  if (!crumbs.length) return null;
  return (
    <nav aria-label="Breadcrumb">
      {crumbs.map((c, i) => (
        <span key={i}>{c}{i < crumbs.length - 1 ? ' › ' : ''}</span>
      ))}
    </nav>
  );
}
```

Notes:
- Guard access with `typeof window !== 'undefined'` to avoid SSR errors.
- The component injects breadcrumbs when the iframe loads; reading on mount is sufficient for most cases. If you expect dynamic updates from the host page, poll `window.setTopics` or expose an event from the host to notify the iframe.

---

## Quick Start

### 1. Basic Embedding

Add these two lines to your HTML:

```html
<!-- Your HTML -->
<wmca-blog app-url="https://your-blog.vercel.app"></wmca-blog>

<!-- Load the web component script -->
<script src="https://your-cdn.com/wmca-blog-component.js"></script>
```

That's it! The blog will appear embedded in your page.

### 2. With Custom Options

```html
<wmca-blog 
  app-url="https://your-blog.vercel.app"
  height="900px"
  theme="dark">
</wmca-blog>
<script src="https://your-cdn.com/wmca-blog-component.js"></script>
```

### 3. Interactive Control

```javascript
const blog = document.querySelector('wmca-blog');

// Navigate to an article
blog.navigateToArticle('my-article-title');

// Navigate to an author
blog.navigateToAuthor('John Smith');

// Reload the blog
blog.reload();
```

---

## Installation

### Step 1: Build the Web Component

From your Next.js project root:

```bash
npm run web-component:build
```

Output: `web-component-dist/wmca-blog-component.js`

### Step 2: Deploy Your Next.js App

```bash
npm run next:build
npm run next:start
```

Or deploy to Vercel:

```bash
vercel deploy
```

Get your public URL: `https://your-blog.vercel.app`

### Step 3: Upload Web Component Script to CDN

Upload `web-component-dist/wmca-blog-component.js` to your CDN:

```
https://your-cdn.com/wmca-blog-component.js
```

Common CDN options:
- **Cloudflare**: `https://cloudcdn.wmca.org.uk/...`
- **AWS CloudFront**: `https://d123456.cloudfront.net/...`
- **Azure CDN**: `https://mycdn.azureedge.net/...`
- **jsDelivr**: `https://cdn.jsdelivr.net/gh/...`

### Step 4: Use in Your Template

```html
<wmca-blog app-url="https://your-blog.vercel.app"></wmca-blog>
<script src="https://your-cdn.com/wmca-blog-component.js"></script>
```

---

## Usage

### HTML Element

The web component is used as a standard HTML element:

```html
<wmca-blog 
  app-url="https://blog.example.com"
  height="800px"
  theme="light"
  id="my-blog">
</wmca-blog>
```

### JavaScript Access

Get a reference to the component:

```javascript
// By ID
const blog = document.getElementById('my-blog');

// By selector
const blog = document.querySelector('wmca-blog');

// All instances
const allBlogs = document.querySelectorAll('wmca-blog');
```

### Multiple Instances

You can embed multiple blogs on the same page:

```html
<!-- Featured blog -->
<wmca-blog 
  id="featured"
  app-url="https://blog.example.com"
  height="600px">
</wmca-blog>

<!-- Sidebar blog -->
<wmca-blog 
  id="sidebar"
  app-url="https://blog.example.com"
  height="400px">
</wmca-blog>

<script src="https://cdn.example.com/wmca-blog-component.js"></script>

<script>
  const featured = document.getElementById('featured');
  const sidebar = document.getElementById('sidebar');
  
  // Control them independently
  featured.navigateToArticle('featured-article');
  sidebar.reload();
</script>
```

---

## Configuration

### Attributes

All attributes are optional. The component accepts the following attributes:

#### `app-url`
- **Type**: String
- **Default**: `http://localhost:3000`
- **Description**: URL of your deployed Next.js blog application
- **Example**: `<wmca-blog app-url="https://blog.example.com">`

#### `height`
- **Type**: CSS Height Value
- **Default**: `800px`
- **Description**: Height of the component container
- **Examples**: `600px`, `100vh`, `50em`
- **Example**: `<wmca-blog height="900px">`

#### `theme`
- **Type**: String (`light` | `dark`)
- **Default**: `light`
- **Description**: Visual theme variant
- **Example**: `<wmca-blog theme="dark">`

#### `data-api-key`
- **Type**: String
- **Default**: (none)
- **Description**: Umbraco API key (stored as data attribute for security)
- **Example**: `<wmca-blog data-api-key="abc123def456">`

### Dynamic Attribute Updates

You can update attributes dynamically:

```javascript
const blog = document.querySelector('wmca-blog');

// Change the app URL
blog.setAttribute('app-url', 'https://new-blog.example.com');

// Change the height
blog.setAttribute('height', '1000px');

// Change the theme
blog.setAttribute('theme', 'dark');

// Get current attribute values
console.log(blog.getAttribute('app-url'));
console.log(blog.getAttribute('height'));
```

---

## API Reference

### Methods

#### `reload()`

Reloads the blog content.

**Syntax**: `blog.reload()`

**Returns**: `undefined`

**Example**:
```javascript
const blog = document.querySelector('wmca-blog');
blog.reload();
```

#### `navigateToArticle(title)`

Navigate to a specific article.

**Syntax**: `blog.navigateToArticle(articleTitle)`

**Parameters**:
- `articleTitle` (String) - The title of the article (URL-encoded automatically)

**Returns**: `undefined`

**Examples**:
```javascript
// Simple title
blog.navigateToArticle('welcome-to-the-blog');

// Title with spaces (automatically encoded)
blog.navigateToArticle('My Article Title');

// From a data attribute
const title = document.querySelector('[data-article]').dataset.article;
blog.navigateToArticle(title);
```

#### `navigateToAuthor(name)`

Navigate to an author's page.

**Syntax**: `blog.navigateToAuthor(authorName)`

**Parameters**:
- `authorName` (String) - The name of the author (URL-encoded automatically)

**Returns**: `undefined`

**Examples**:
```javascript
// Simple name
blog.navigateToAuthor('John Smith');

// From a data attribute
const author = document.querySelector('[data-author]').dataset.author;
blog.navigateToAuthor(author);
```

### Properties

#### `iframeElement`

Direct reference to the underlying iframe element.

**Type**: `HTMLIFrameElement`

**Example**:
```javascript
const blog = document.querySelector('wmca-blog');

// Get the current URL
console.log(blog.iframeElement.src);

// Manually set iframe src (not recommended - use navigateToArticle instead)
blog.iframeElement.src = 'https://blog.example.com/custom-url';
```

### Events

The web component listens to standard DOM events:

```javascript
const blog = document.querySelector('wmca-blog');

// Standard element events
blog.addEventListener('load', () => {
  console.log('Blog loaded');
});

// Iframe load event
blog.iframeElement.addEventListener('load', () => {
  console.log('Iframe content loaded');
});
```

---

## Styling & Theming

### CSS Custom Properties

The component exposes CSS custom properties for theming:

```javascript
// Light theme
--wmca-blog-bg: #ffffff;
--wmca-blog-text: #000000;

// Dark theme
--wmca-blog-bg: #1a1a1a;
--wmca-blog-text: #ffffff;
```

### Host Styling

Style the component's host element:

```css
wmca-blog {
  /* Container styles */
  margin: 2rem 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  /* Theme variables */
  --wmca-blog-bg: #f5f5f5;
  --wmca-blog-text: #333;
}
```

### Responsive Sizing

```css
/* Desktop */
wmca-blog {
  height: 800px;
}

/* Tablet */
@media (max-width: 1024px) {
  wmca-blog {
    height: 700px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  wmca-blog {
    height: 600px;
  }
}
```

### Shadow DOM Limitations

The component uses Shadow DOM for encapsulation. External CSS cannot directly style the internal content. Instead:

1. **Use CSS custom properties** for color/theme customization
2. **Style the host element** (`wmca-blog`) directly
3. **Pass styling through the `theme` attribute** for built-in themes

---

## Security

### Iframe Sandboxing

The component uses iframe sandboxing by default:

```javascript
iframe.setAttribute('sandbox', 
  'allow-same-origin allow-scripts allow-popups allow-forms'
);
```

This prevents:
- ❌ Top-level navigation (unless user initiates it)
- ❌ Plugin content execution
- ❌ Automatic form submission
- ❌ Cross-origin policy violations

### API Key Management

For Umbraco API access:

```html
<!-- Good: Key stored in attribute -->
<wmca-blog data-api-key="your-key"></wmca-blog>

<!-- Better: Key stored in environment variable on server -->
<!-- In your Next.js app: process.env.UMBRACO_API_KEY -->
```

**Best Practice**: Store API keys in environment variables on the server, not in client-side code.

### CORS Configuration

Ensure your Next.js app allows cross-origin requests:

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
            value: 'https://your-domain.com',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
        ],
      },
    ];
  },
};
```

### Content Security Policy (CSP)

Make the component CSP-compatible:

```html
<!-- Allow trusted CDN for web component script -->
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' https://your-cdn.com">
```

---

## Troubleshooting

### Component Not Appearing

**Problem**: The `<wmca-blog>` element doesn't render or shows blank.

**Solutions**:

1. Check that the script loaded:
```javascript
console.log(customElements.get('wmca-blog')); // Should return the component class
```

2. Verify the app URL is correct:
```javascript
const blog = document.querySelector('wmca-blog');
console.log(blog.getAttribute('app-url'));
```

3. Check browser console for errors (F12 → Console tab)

4. Verify the Next.js app is running and accessible:
```bash
curl https://your-blog.vercel.app
```

### Component Shows But Is Blank

**Problem**: The element renders but shows no content.

**Solutions**:

1. Check iframe source URL:
```javascript
const blog = document.querySelector('wmca-blog');
console.log(blog.iframeElement.src);
```

2. Check for CORS errors in console
3. Verify Next.js app is working: Visit `app-url` in your browser
4. Check that the app uses `output: 'standalone'` in `next.config.js`

### CORS Errors

**Problem**: "Cross-Origin Request Blocked" in console.

**Solutions**:

1. Ensure both blog and containing page are on same domain, OR
2. Configure CORS headers in Next.js app:
```javascript
// next.config.js
headers: [
  {
    source: '/:path*',
    headers: [
      {
        key: 'Access-Control-Allow-Origin',
        value: '*',
      },
    ],
  },
]
```

3. Check browser CORS policy (some browsers are more restrictive)

### Navigation Not Working

**Problem**: `navigateToArticle()` or `navigateToAuthor()` doesn't navigate.

**Solutions**:

1. Verify the component reference:
```javascript
const blog = document.querySelector('wmca-blog');
console.log(blog); // Should not be null
```

2. Verify the method exists:
```javascript
console.log(typeof blog.navigateToArticle); // Should be 'function'
```

3. Check that the article/author exists
4. Check console for errors

### Event Listeners Not Firing

**Problem**: Event listeners attached to component don't trigger.

**Solutions**:

1. Attach to the iframe instead:
```javascript
blog.iframeElement.addEventListener('load', () => {
  console.log('Loaded');
});
```

2. Use a delay to ensure component is ready:
```javascript
setTimeout(() => {
  const blog = document.querySelector('wmca-blog');
  if (blog) blog.reload();
}, 500);
```

### Styling Issues

**Problem**: Styles from page don't apply to web component content.

**Solutions**:

1. Shadow DOM isolates styles intentionally
2. Use CSS custom properties:
```css
wmca-blog {
  --wmca-blog-text: #333;
  --wmca-blog-bg: #fff;
}
```

3. Style the host element:
```css
wmca-blog {
  border-radius: 8px;
  margin: 2rem 0;
}
```

### Component Load Performance

**Problem**: Component takes a long time to load.

**Solutions**:

1. Use lazy loading:
```html
<script src="..." defer></script>
```

2. Load the script asynchronously:
```html
<script src="..." async></script>
```

3. Use a separate thread:
```html
<script>
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Load component when browser is idle
    });
  }
</script>
```

---

## Examples

### Umbraco Template Integration

```c#
@using Umbraco.Cms.Web.Common.PublishedModels;
@inherits Umbraco.Cms.Web.Common.Views.UmbracoViewPage<ContentModels.BlogPage>

<section class="blog-container">
    <h1>@Model.Value<string>("title")</h1>
    
    <wmca-blog 
        app-url="@Model.Value<string>("blogUrl")"
        height="900px"
        theme="@(Request.Query["darkMode"] == "true" ? "dark" : "light")">
    </wmca-blog>
</section>

<script src="@Model.Value<string>("cdnPath")"></script>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const blog = document.querySelector('wmca-blog');
        
        // Listen for article clicks
        document.querySelectorAll('[data-blog-link]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const type = this.dataset.blogLink;
                const value = this.dataset.value;
                
                if (type === 'article') {
                    blog.navigateToArticle(value);
                } else if (type === 'author') {
                    blog.navigateToAuthor(value);
                }
            });
        });
    });
</script>
```

### React Component Wrapper

```jsx
import { useEffect, useRef } from 'react';

export function WmcaBlogComponent({ appUrl, height = '800px', theme = 'light' }) {
  const ref = useRef(null);

  useEffect(() => {
    // Ensure web component script is loaded
    if (!customElements.get('wmca-blog')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.example.com/wmca-blog-component.js';
      document.body.appendChild(script);
    }
  }, []);

  const navigate = (type, value) => {
    if (ref.current) {
      if (type === 'article') {
        ref.current.navigateToArticle(value);
      } else if (type === 'author') {
        ref.current.navigateToAuthor(value);
      }
    }
  };

  return (
    <>
      <wmca-blog 
        ref={ref}
        app-url={appUrl}
        height={height}
        theme={theme}
      />
      <button onClick={() => navigate('article', 'hello-world')}>
        View Article
      </button>
    </>
  );
}
```

### Vue Component Wrapper

```vue
<template>
  <div class="blog-wrapper">
    <wmca-blog 
      :app-url="appUrl"
      :height="height"
      :theme="theme"
      ref="blogComponent"
    />
    <button @click="navigateToArticle('hello-world')">View Article</button>
  </div>
</template>

<script>
export default {
  props: {
    appUrl: String,
    height: { type: String, default: '800px' },
    theme: { type: String, default: 'light' },
  },
  mounted() {
    // Load web component script if needed
    if (!customElements.get('wmca-blog')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.example.com/wmca-blog-component.js';
      document.body.appendChild(script);
    }
  },
  methods: {
    navigateToArticle(title) {
      this.$refs.blogComponent.navigateToArticle(title);
    },
  },
};
</script>
```

### Auto-Linking Blog Articles

```html
<wmca-blog id="blog" app-url="https://blog.example.com"></wmca-blog>

<nav>
  <a href="#" data-article="getting-started">Getting Started</a>
  <a href="#" data-article="best-practices">Best Practices</a>
  <a href="#" data-article="faq">FAQ</a>
</nav>

<script src="https://cdn.example.com/wmca-blog-component.js"></script>
<script>
  const blog = document.querySelector('#blog');
  
  document.querySelectorAll('[data-article]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      blog.navigateToArticle(link.dataset.article);
    });
  });
</script>

### Breadcrumbs Example

Pass breadcrumbs either via attribute or JS. The component injects them into the iframe as `window.setTopics.breadcrumbs = { breadcrumb: [...] }`.

HTML (JSON array):

```html
<wmca-blog id="blog" app-url="https://blog.example.com" breadcrumbs='["Home","News","Covid"]'></wmca-blog>
<script src="https://cdn.example.com/wmca-blog-component.js"></script>
```

Programmatic (JS):

```javascript
const blog = document.querySelector('#blog');
// Update breadcrumbs dynamically
blog.setBreadcrumbs(['Home', 'Topics', 'Transport']);
```

#### `name`
- **Type**: String
- **Default**: (none)
- **Description**: Optional display name for the embedded blog. When provided the web app can read it from `window.setTopics.name` and show it in banners or headings.
- **Example**: `<wmca-blog name="WMCA Blog" app-url="https://blog.example.com"></wmca-blog>`
```

---

## Support & Resources

- **GitHub**: [wmca/wmca-blog](https://github.com/wmca/wmca-blog)
- **Documentation**: [docs/WEB-COMPONENT-INTEGRATION.md](./WEB-COMPONENT-INTEGRATION.md)
- **Demo**: [demo.html](../demo.html)
- **Issues**: Report via GitHub Issues

---

**Last Updated**: March 2024 | **Version**: 1.0.0
