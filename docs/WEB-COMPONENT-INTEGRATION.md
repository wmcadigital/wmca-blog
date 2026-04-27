# Web Component Integration Guide

## Overview

Your Next.js blog app can be embedded as a custom web component (`<wmca-blog>`) in any Umbraco template or external website.

## Quick Start

### 1. Build the Web Component

```bash
npm run web-component:build
```

This creates a standalone JavaScript file in `web-component-dist/wmca-blog-component.js`.

### 2. Deploy Your Next.js App

Deploy the app to Vercel (recommended) or your hosting platform:

```bash
npm run next:build
npm run next:start
```

Get the public URL of your deployed app (e.g., `https://wmca-blog.vercel.app`).

### 3. Upload the Web Component Script

Upload `web-component-dist/wmca-blog-component.js` to your CDN:

```
https://your-cdn.com/wmca-blog-component.js
```

### 4. Add to Umbraco Template

In your Umbraco template HTML:

```html
<!-- Container for the web component -->
<wmca-blog 
  app-url="https://wmca-blog.vercel.app"
  height="800px"
  theme="light">
</wmca-blog>

<!-- Load the web component script (before closing body tag) -->
<script src="https://your-cdn.com/wmca-blog-component.js"></script>
```

## Component Attributes

| Attribute | Description | Default | Required |
|-----------|-------------|---------|----------|
| `app-url` | URL of your deployed Next.js app | `http://localhost:3000` | No |
| `height` | Height of the iframe container | `800px` | No |
| `theme` | Visual theme: `light` or `dark` | `light` | No |
| `data-api-key` | Umbraco API key (stored as data attribute) | - | No |

## Usage Examples

### Basic Embedding

```html
<wmca-blog app-url="https://wmca-blog.vercel.app"></wmca-blog>
<script src="https://cdn.example.com/wmca-blog-component.js"></script>
```

### Custom Height and Theme

```html
<wmca-blog 
  app-url="https://wmca-blog.vercel.app"
  height="1000px"
  theme="dark">
</wmca-blog>
<script src="https://cdn.example.com/wmca-blog-component.js"></script>
```

### With API Key

```html
<wmca-blog 
  app-url="https://wmca-blog.vercel.app"
  data-api-key="your-umbraco-api-key">
</wmca-blog>
<script src="https://cdn.example.com/wmca-blog-component.js"></script>
```

## JavaScript API

You can control the component programmatically:

```javascript
const blog = document.querySelector('wmca-blog');

// Reload the blog
blog.reload();

// Navigate to a specific article
blog.navigateToArticle('my-article-title');

// Navigate to an author page
blog.navigateToAuthor('John Doe');
```

## Umbraco-Specific Integration

### Option A: Property Editor (Recommended)

Create a custom property editor in Umbraco that:
1. Stores the `app-url`
2. Renders the web component with the stored URL

```c#
// Example Umbraco PropertyEditorValueConverter
public class WmcaBlogConverter : PropertyValueConverter
{
    public override object ConvertSourceToIntermediate(
        IPublishedElement owner, 
        IPublishedPropertyType propertyType, 
        object source, 
        bool preview)
    {
        var config = JsonConvert.DeserializeObject<WmcaBlogConfig>(source?.ToString());
        return config;
    }
}
```

### Option B: Static Template Macro

Create a Macro in Umbraco:

```html
@Html.Partial("~/Views/Macros/WmcaBlog.cshtml", new { AppUrl = Model.BlogUrl })

<!-- In partial view -->
<wmca-blog app-url="@Model.AppUrl"></wmca-blog>
<script src="@Model.CdnPath/wmca-blog-component.js"></script>
```

### Option C: Content Block

Add to an Umbraco template as a simple snippet:

```html
@if (Model.HasValue("wmcaBlogContent"))
{
    <wmca-blog app-url="https://wmca-blog.vercel.app"></wmca-blog>
    <script src="https://cdn.example.com/wmca-blog-component.js"></script>
}
```

## Styling & CSS

The web component uses Shadow DOM encapsulation, so external CSS won't affect it directly. However, you can:

1. **Pass custom CSS** via CSS custom properties:

```html
<style>
  wmca-blog {
    --wmca-blog-bg: #f5f5f5;
    --wmca-blog-text: #333;
  }
</style>
```

2. **Adjust container styling** at the host level:

```css
wmca-blog {
  margin: 2rem 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

3. **Apply responsive sizing**:

```css
wmca-blog {
  height: auto;
  min-height: 800px;
}

@media (max-width: 768px) {
  wmca-blog {
    min-height: 600px;
  }
}
```

## Security & Sandboxing

The web component uses iframe sandboxing for security:

```javascript
iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms');
```

This prevents:
- Top-level navigation unless user-initiated
- Form submission to external targets
- Automated plugin content
- Same-origin policy violations

Adjust as needed for your security requirements.

## Environment Variables

For the deployed Next.js app, ensure these env vars are set:

```env
# .env.production
NEXT_PUBLIC_BLOG_URL=https://wmca-blog.vercel.app
UMBRACO_API_KEY=your-api-key
REACT_APP_UMBRACO_API_KEY=your-api-key
```

## Troubleshooting

### Component Not Showing

1. Check browser console for errors
2. Verify `app-url` is correct and accessible
3. Ensure the web component script loaded: `window.WmcaBlogComponent` should exist

```javascript
console.log(customElements.get('wmca-blog')); // Should return the component class
```

### CORS Issues

If the blog is on a different domain, ensure Umbraco allows cross-origin requests or deploy to same domain.

### Styling Not Applied

- External CSS won't penetrate Shadow DOM
- Use CSS custom properties or inline styles on the component
- Ensure WMCA stylesheets load inside the iframe

## Next Steps

1. Deploy Next.js app to production
2. Build web component: `npm run web-component:build`
3. Upload component script to CDN
4. Add to Umbraco templates using examples above
5. Test in multiple browsers/devices
