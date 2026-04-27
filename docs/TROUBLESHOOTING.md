# Web Component Troubleshooting & FAQ

Common issues and frequently asked questions about the WMCA Blog Web Component.

## Quick Diagnostics

Run this in your browser console to check component status:

```javascript
// Check if component is registered
console.log('Component registered:', !!customElements.get('wmca-blog'));

// Find all instances
const blogs = document.querySelectorAll('wmca-blog');
console.log('Found instances:', blogs.length);

// Check an instance
if (blogs.length > 0) {
  const blog = blogs[0];
  console.log('App URL:', blog.getAttribute('app-url'));
  console.log('Height:', blog.getAttribute('height'));
  console.log('Theme:', blog.getAttribute('theme'));
  console.log('Iframe src:', blog.iframeElement?.src);
  console.log('Has reload method:', typeof blog.reload === 'function');
}
```

---

## Component Not Appearing

### Symptom
- The `<wmca-blog>` element renders as an empty div
- No content shows in the component
- Browser shows no console errors

### Diagnosis

1. **Check if script loaded**:
```javascript
window.WmcaBlogComponent // Should not be undefined
customElements.get('wmca-blog') // Should return the component class
```

2. **Check if element exists**:
```javascript
document.querySelector('wmca-blog') // Should return the element
```

3. **Check attributes**:
```javascript
const blog = document.querySelector('wmca-blog');
console.log({
  appUrl: blog.getAttribute('app-url'),
  height: blog.getAttribute('height'),
  theme: blog.getAttribute('theme')
});
```

### Solutions

**Solution 1: Verify Script Loaded**

Check Network tab (F12 → Network):
- [ ] `wmca-blog-component.js` shows 200 status
- [ ] Script finishes loading before `<wmca-blog>` appears in DOM

If not loading, check:
- ✓ CDN URL is correct: `https://your-cdn.com/wmca-blog-component.js`
- ✓ No typos in the src attribute
- ✓ CORS headers allow the request
- ✓ File exists on CDN

**Solution 2: Script After Element**

Ensure script loads AFTER the element is in DOM:

```html
<!-- ✓ Correct order -->
<wmca-blog app-url="https://blog.example.com"></wmca-blog>
<script src="https://cdn.example.com/wmca-blog-component.js"></script>

<!-- ✗ Wrong - script in <head> may load before element exists -->
<head>
  <script src="https://cdn.example.com/wmca-blog-component.js"></script>
</head>
```

**Solution 3: Use Async/Defer**

If loading in `<head>`, use attributes:

```html
<head>
  <script src="..." async defer></script>
</head>
<body>
  <wmca-blog app-url="..."></wmca-blog>
</body>
```

**Solution 4: Reinitialize Component**

If component loads after page init:

```javascript
// Wait for script to load, then create element
setTimeout(() => {
  const blog = document.createElement('wmca-blog');
  blog.setAttribute('app-url', 'https://blog.example.com');
  blog.setAttribute('height', '800px');
  document.body.appendChild(blog);
}, 1000);
```

---

## Component Shows But Is Blank

### Symptom
- Component renders (visible border/container)
- No blog content displays inside
- May show loading spinner or blank white space

### Diagnosis

1. **Check iframe source**:
```javascript
const blog = document.querySelector('wmca-blog');
console.log('Iframe source:', blog.iframeElement?.src);
// Should start with your app URL
```

2. **Check if iframe loaded**:
```javascript
const iframe = blog.iframeElement;
console.log('Iframe loaded:', iframe?.complete);
iframe?.addEventListener('load', () => console.log('Loaded!'));
```

3. **Verify app is accessible**:
```javascript
fetch('https://your-app.vercel.app')
  .then(r => console.log('App status:', r.status))
  .catch(e => console.error('App error:', e));
```

### Solutions

**Solution 1: Verify App URL**

Check that `app-url` is correct:

```javascript
const blog = document.querySelector('wmca-blog');
const url = blog.getAttribute('app-url');
console.log('App URL:', url);

// Try to fetch from app
fetch(url).then(r => console.log('Status:', r.status));
```

**Solution 2: Check App Status**

Visit the URL in a new browser tab:
- [ ] Opens successfully
- [ ] Shows blog content
- [ ] No 404 or error page
- [ ] Has proper CORS headers

If app doesn't load:
- Check if Next.js app is running: `npm run next:start`
- Check if deployment succeeded
- Check server logs for errors

**Solution 3: Wait for App to Deploy**

If recently deployed:
```javascript
// Wait 30 seconds for app to start
setTimeout(() => {
  const blog = document.querySelector('wmca-blog');
  blog.reload();
}, 30000);
```

**Solution 4: Check Browser Console**

Open F12 → Console and look for:

**CORS errors** like:
```
Access to iframe at 'https://app.com' from origin 'https://site.com' 
has been blocked by CORS policy
```

→ Solution: Configure CORS in Next.js app (see [CORS Configuration](#cors-configuration))

**Security errors** like:
```
Refused to frame 'https://app.com' because it violates the 
Content Security Policy directive
```

→ Solution: Update CSP headers in Umbraco/web server

---

## CORS Errors

### Symptom
Console shows:
```
Access to XMLHttpRequest at 'https://cms.wmca.org.uk/umbraco/delivery/api/v2/...' 
from origin 'https://site.wmca.org.uk' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### Root Cause
The browser blocks cross-origin API requests unless allowed by CORS headers.

### Solutions

**Solution 1: Configure CORS in Next.js** (Recommended)

Update `next.config.js`:

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://your-umbraco-domain.com',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

**Solution 2: Allow All Origins** (Development Only)

For testing, temporarily allow all:

```javascript
headers: [
  {
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: '*' },
    ],
  },
]
```

**Solution 3: Umbraco CORS**

If Umbraco API is blocking, configure in `appsettings.json`:

```json
{
  "Umbraco": {
    "Cms": {
      "Global": {
        "AllowCorsOrigins": [
          "https://blog.wmca.org.uk",
          "https://your-site.wmca.org.uk"
        ]
      }
    }
  }
}
```

---

## Navigation Not Working

### Symptom
- Clicking links in blog doesn't navigate
- `navigateToArticle()` method doesn't work
- Still shows the home page

### Solutions

**Solution 1: Verify Component Reference**

```javascript
const blog = document.querySelector('wmca-blog');
if (!blog) {
  console.error('Component not found');
} else {
  console.log('Component found:', blog);
}
```

**Solution 2: Verify Method Exists**

```javascript
const blog = document.querySelector('wmca-blog');
console.log('Has reload:', typeof blog.reload === 'function');
console.log('Has navigateToArticle:', typeof blog.navigateToArticle === 'function');
console.log('Has navigateToAuthor:', typeof blog.navigateToAuthor === 'function');
```

**Solution 3: Check for JavaScript Errors**

Open F12 → Console and look for red errors. Navigate to article to trigger any errors.

**Solution 4: Verify Article Exists**

Make sure the article title is correct:

```javascript
const blog = document.querySelector('wmca-blog');
blog.navigateToArticle('correct-article-title');
// Try with exact URL path from the browser
```

**Solution 5: Use Correct URL Format**

Article titles should be URL-friendly (lowercase, hyphens):

```javascript
// ✓ Correct
blog.navigateToArticle('hello-world');
blog.navigateToArticle('getting-started-guide');

// ✗ Incorrect (spaces, capitals)
blog.navigateToArticle('Hello World');
blog.navigateToArticle('Getting Started Guide');
```

---

## Performance Issues

### Symptom
- Component takes a long time to load
- Page feels slow
- High CPU usage

### Solutions

**Solution 1: Defer Script Loading**

```html
<!-- Load script after page renders -->
<script src="..." defer></script>

<!-- Or load asynchronously -->
<script src="..." async></script>
```

**Solution 2: Lazy Load Component**

Only create component when needed:

```javascript
document.addEventListener('scroll', () => {
  const blogElement = document.getElementById('blog-container');
  if (isInViewport(blogElement) && !element.querySelector('wmca-blog')) {
    const blog = document.createElement('wmca-blog');
    blog.setAttribute('app-url', 'https://blog.example.com');
    blogElement.appendChild(blog);
  }
});
```

**Solution 3: Load Script on Demand**

```javascript
// Load script only when blog button clicked
document.getElementById('show-blog-btn').addEventListener('click', () => {
  const script = document.createElement('script');
  script.src = 'https://cdn.example.com/wmca-blog-component.js';
  script.onload = () => {
    const blog = document.createElement('wmca-blog');
    blog.setAttribute('app-url', 'https://blog.example.com');
    document.body.appendChild(blog);
  };
  document.body.appendChild(script);
});
```

**Solution 4: Check Next.js App Performance**

```bash
# Build with analysis
npm run next:build -- --analyze

# Check bundle size
npm install --save-dev @next/bundle-analyzer

# Run Lighthouse
npm run lhci:collect
```

---

## Styling Issues

### Symptom
- Styles from main page affect content inside component
- Component doesn't respect theme attribute
- Grid/layout is broken

### Root Cause
Shadow DOM provides CSS encapsulation. External styles shouldn't affect internal content.

### Solutions

**Solution 1: Use CSS Custom Properties**

```css
wmca-blog {
  --wmca-blog-bg: #f5f5f5;
  --wmca-blog-text: #333;
}
```

**Solution 2: Style Host Element**

```css
wmca-blog {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin: 2rem 0;
}
```

**Solution 3: Responsive Height**

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

**Solution 4: Theme Variants**

```css
/* Light theme */
body.light-theme wmca-blog {
  --wmca-blog-bg: #ffffff;
  --wmca-blog-text: #000000;
}

/* Dark theme */
body.dark-theme wmca-blog {
  --wmca-blog-bg: #1a1a1a;
  --wmca-blog-text: #ffffff;
}
```

---

## Event Listeners Not Firing

### Symptom
Attached event listeners don't trigger

### Solutions

**Solution 1: Attach to Iframe**

```javascript
const blog = document.querySelector('wmca-blog');

// Attach to actual iframe
blog.iframeElement.addEventListener('load', () => {
  console.log('Loaded');
});
```

**Solution 2: Wait for Component to Initialize**

```javascript
// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
  const blog = document.querySelector('wmca-blog');
  if (blog) {
    blog.reload();
  }
});
```

**Solution 3: Use MutationObserver**

```javascript
const blog = document.querySelector('wmca-blog');

// Watch for attribute changes
new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    console.log('Attribute changed:', mutation.attributeName);
  });
}).observe(blog, { attributes: true });
```

---

## Multiple Instances Issue

### Symptom
Only one blog component works when multiple are on the page

### Solution 1: Use IDs

```html
<wmca-blog id="blog-1" app-url="https://blog.example.com"></wmca-blog>
<wmca-blog id="blog-2" app-url="https://blog.example.com"></wmca-blog>

<script src="..."></script>

<script>
  const blog1 = document.getElementById('blog-1');
  const blog2 = document.getElementById('blog-2');
  
  blog1.navigateToArticle('article-1');
  blog2.navigateToArticle('article-2');
</script>
```

### Solution 2: Query Each Instance

```javascript
document.querySelectorAll('wmca-blog').forEach((blog, index) => {
  console.log(`Blog ${index}:`, blog.getAttribute('app-url'));
  blog.reload();
});
```

---

## Deployment Issues

### App Not Accessible After Deploy

**Check deployment status**:

```bash
# Vercel
vercel ls

# Docker
docker ps | grep wmca-blog

# PM2
pm2 status
```

**View logs**:

```bash
pm2 logs wmca-blog
docker logs container_id
curl https://blog.example.com  # Test if running
```

### Web Component Script Not Found (404)

1. Verify file exists on CDN
2. Check file permissions
3. Test direct URL: `curl https://cdn.example.com/wmca-blog-component.js`
4. Check CDN configuration/caching

### Changes Not Appearing

**Clear browser cache**:
- Ctrl+Shift+R (Windows/Linux)
- Cmd+Shift+R (Mac)
- Or use Incognito/Private browsing

**Clear CDN cache** (if using one):
```bash
# Cloudflare
curl -X POST https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"files": ["https://cdn.example.com/wmca-blog-component.js"]}'
```

---

## Frequently Asked Questions

### Q: Can I use the component without deploying the Next.js app?

**A**: No. The component is just a wrapper that embeds your Next.js app in an iframe. You need a deployed, publicly accessible Next.js app.

### Q: Does the component work on HTTP? (Not HTTPS)

**A**: Mixed content is not allowed. If your site is HTTPS, your blog app must be HTTPS too.

### Q: Can I embed multiple blogs with different URLs?

**A**: Yes! Each instance can have its own `app-url`:

```html
<wmca-blog app-url="https://blog1.example.com"></wmca-blog>
<wmca-blog app-url="https://blog2.example.com"></wmca-blog>
```

### Q: Is the component compatible with React/Vue/Angular?

**A**: Yes! Web components work in any framework. See [docs/WEB-COMPONENT-README.md](./WEB-COMPONENT-README.md#examples) for examples.

### Q: Can I customize the styling?

**A**: Limited customization is possible using CSS custom properties and host styling. Internal styles are protected by Shadow DOM.

### Q: Does the component support SSR?

**A**: No. The component is a client-side element. It requires JavaScript to be enabled.

### Q: What's the file size of the component?

**A**: Typically 2-5 KB, depending on minification.

### Q: Do I need an API key?

**A**: Only if your Umbraco API requires authentication. Set it via the `data-api-key` attribute or environment variable.

### Q: Can I host the component on my own server?

**A**: Yes. Upload `web-component-dist/wmca-blog-component.js` to your static file server.

### Q: What happens if the app URL is wrong?

**A**: The component will display, but the iframe will show a 404 error or blank page.

### Q: Can I use the component in Iframe sandbox mode?

**A**: The component already uses iframe sandboxing. It's secure by default.

### Q: How do I update to a new version?

**A**: 

1. Pull latest code: `git pull`
2. ```bash
   npm install
   npm run web-component:build
   ```
3. Upload new file to CDN: `web-component-dist/wmca-blog-component.js`
4. Clear CDN cache if needed
5. Verify in browser (hard refresh: Ctrl+Shift+R)

### Q: Does the component track analytics?

**A**: Analytics tracking depends on your Next.js app configuration. See [src/analytics/index.js](../src/analytics/).

### Q: Can I customize the iframe sandbox attributes?

**A**: Not yet. To customize, you'd need to modify [src/WebComponent.js](../src/WebComponent.js).

### Q: Tests for the component?

**A**: Run tests with: `npm test -- WebComponent` (if test files exist)

---

## Getting Help

1. **Check this guide** - covers 95% of common issues
2. **Check browser console** (F12) - most errors are logged there
3. **Review the docs** - [WEB-COMPONENT-README.md](./WEB-COMPONENT-README.md)
4. **Check deployment guide** - [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)
5. **Search GitHub issues** - [wmca/wmca-blog/issues](https://github.com/wmca/wmca-blog/issues)
6. **Open a new issue** with:
   - Browser/version
   - Error message from console
   - Steps to reproduce
   - Screenshots if applicable

---

**Last Updated**: March 2024
