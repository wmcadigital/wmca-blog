# SEO Improvements — Implementation Guide

## Overview

This document describes the SEO enhancements implemented for the WMCA blog application, including structured data (schema.org), canonical URLs, and enhanced meta tags.

---

## Features Implemented

### 1. **Canonical URLs**
- **What**: Adds `<link rel="canonical">` to prevent duplicate content penalties in search results
- **Where**: 
  - Article pages: `src/Blog/BlogArticle.js`
  - Topic/list pages: `src/Blog/BlogArticles.js`
- **How**: Generated from `window.location.href` or provided URL with query parameters and hash fragments removed
- **Benefit**: Tells search engines which version of a page is the "primary" version

### 2. **JSON-LD Structured Data**

#### Article Schema (NewsArticle)
- **File**: `src/helpers/seoHelpers.js` → `generateArticleSchema()`
- **Location**: Injected into `<Head>` of article pages via `<script type="application/ld+json">`
- **Data Included**:
  - Headline, description, image
  - Author (Person or Organization)
  - Publication date (datePublished, dateModified)
  - Publisher information
  - Main entity reference to article URL
- **Benefit**: Helps Google understand article content, enables rich search results, and improves knowledge graph entries

#### Breadcrumb Schema (BreadcrumbList)
- **File**: `src/helpers/seoHelpers.js` → `generateBreadcrumbSchema()`
- **Location**: All pages (article and list pages)
- **Data Included**:
  - Hierarchical navigation path (Home → Blog → Topic → Article)
  - Position numbers and URLs
- **Benefit**: Enhances breadcrumb navigation in search results, improves UX in SERPs

#### Organization Schema
- **File**: `src/helpers/seoHelpers.js` → `generateOrganizationSchema()`
- **Location**: All pages
- **Data Included**:
  - Organization name, URL, logo
  - Social media links (Facebook, Twitter, LinkedIn)
- **Benefit**: Establishes organizational identity, enables rich snippets in search results

### 3. **Enhanced Meta Tags**

#### Article Pages (`BlogArticle.js`)
```html
<!-- Basic SEO -->
<meta name="description" content="...article introduction..." />
<meta name="keywords" content="...article tags..." />
<meta name="author" content="...article author..." />
<meta name="robots" content="index, follow" />

<!-- Open Graph (Social Sharing) -->
<meta property="og:type" content="article" />
<meta property="article:published_time" content="...date..." />
<meta property="article:author" content="...author..." />
<meta property="article:tag" content="...tags..." />

<!-- Twitter Card (Twitter Sharing) -->
<meta name="twitter:card" content="summary_large_image" />
```

#### List Pages (`BlogArticles.js`)
```html
<!-- Basic SEO -->
<meta name="description" content="...topic summary..." />
<meta name="keywords" content="...topic name..." />

<!-- Open Graph (Social Sharing) -->
<meta property="og:type" content="website" />
```

---

## Technical Implementation

### File: `src/helpers/seoHelpers.js`

```javascript
// Generate Article schema for JSON-LD
export const generateArticleSchema(article, baseUrl, articlePath) { ... }

// Generate Breadcrumb schema for JSON-LD
export const generateBreadcrumbSchema(breadcrumbs, currentTitle) { ... }

// Generate Organization schema for JSON-LD
export const generateOrganizationSchema() { ... }

// Generate canonical URL
export const generateCanonicalUrl(baseUrl, path) { ... }
```

### Integration Points

#### `BlogArticle.js` (Article Page)
```javascript
import { generateArticleSchema, generateBreadcrumbSchema, generateOrganizationSchema, generateCanonicalUrl } from "../helpers/seoHelpers";

// Generate SEO data
const baseUrl = hasWindow ? `${window.location.protocol}//${window.location.host}` : "https://www.wmca.org.uk";
const currentPath = hasWindow ? window.location.pathname : "";
const canonicalUrl = generateCanonicalUrl(baseUrl, currentPath);

// Generate schemas
const articleSchema = generateArticleSchema(article, baseUrl, currentPath);
const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems, article?.name);
const organizationSchema = generateOrganizationSchema();

// Render in Head
<Head>
  <link rel="canonical" href={canonicalUrl} />
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
</Head>
```

#### `BlogArticles.js` (List/Topic Page)
```javascript
import { generateBreadcrumbSchema, generateOrganizationSchema, generateCanonicalUrl } from "../helpers/seoHelpers";

// Generate canonical URL from topic
<link rel="canonical" href={topicsGlobal.url} />

// Render breadcrumb and organization schemas
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(...)) }} />
```

---

## SEO Benefits

### Search Engine Optimization
1. **Better Content Understanding**: JSON-LD structured data helps search engines understand article structure and relationships
2. **Rich Snippets**: Articles may appear with rich snippets in search results (author, publication date, star ratings if available)
3. **Knowledge Graph**: Organization schema helps Google build knowledge graph entries
4. **Duplicate Content Prevention**: Canonical URLs prevent penalty for duplicate content across pages

### User Experience in Search Results
- Breadcrumb navigation shown in SERPs
- Publication dates visible
- Author information displayed
- Social sharing with proper title/description/image

### Social Media Integration
- Open Graph tags ensure proper sharing on Facebook, LinkedIn, etc.
- Twitter Card tags create optimized Twitter previews
- Images, titles, and descriptions render correctly when shared

---

## Testing & Verification

### Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your site property
3. Use URL Inspection tool to test article pages
4. Look for "Article" or "NewsArticle" in Rich Results

### Schema.org Validator
1. Visit [Schema.org Validator](https://validator.schema.org/)
2. Paste article URL
3. Verify article, breadcrumb, and organization schemas are detected

### Open Graph Preview
1. Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/sharing/)
2. Enter article URL
3. Verify og:title, og:description, og:image render correctly

### Twitter Card Preview
1. Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Enter article URL
3. Verify twitter:title, twitter:description, twitter:image render correctly

### Local Testing
```bash
# Start dev server
npm run dev

# Open article page in browser
# Right-click → View Page Source
# Search for <script type="application/ld+json">
# Verify JSON schemas are present
# Verify canonical link is present
```

---

## Future Enhancements

### Phase 2 (Optional)
- [ ] Add `author` meta tag with Google Author Profile
- [ ] Add `dateModified` in addition to `datePublished`
- [ ] Add rating/review schema if comments are implemented
- [ ] Add FAQ schema if FAQ section exists
- [ ] Add image schema for featured images
- [ ] Implement AMP (Accelerated Mobile Pages) if needed
- [ ] Add sitelinks search box schema

### Monitoring
- Track search console impressions and CTR over time
- Monitor rich results in Google Search Console
- Set up analytics tracking for organic traffic
- Monitor Core Web Vitals in Google Console

---

## Files Modified

1. **`src/helpers/seoHelpers.js`** (NEW)
   - Helper functions for generating structured data and canonical URLs

2. **`src/Blog/BlogArticle.js`**
   - Added imports: `generateArticleSchema`, `generateBreadcrumbSchema`, `generateOrganizationSchema`, `generateCanonicalUrl`
   - Enhanced `<Head>` section with:
     - Canonical URL
     - Enhanced meta tags (keywords, author, robots, language)
     - Article-specific Open Graph tags (article:published_time, article:author, article:tag)
     - Twitter Card tags with image alt text
     - JSON-LD article schema
     - JSON-LD breadcrumb schema
     - JSON-LD organization schema

3. **`src/Blog/BlogArticles.js`**
   - Added imports: `generateBreadcrumbSchema`, `generateOrganizationSchema`, `generateCanonicalUrl`
   - Enhanced `<Head>` section with:
     - Canonical URL from topic page
     - Enhanced meta tags
     - Open Graph tags with image alt text
     - Twitter Card tags
     - JSON-LD breadcrumb schema
     - JSON-LD organization schema

---

## Maintenance

### Regular Checks
- Monitor Search Console for crawl errors
- Check for 404 errors on canonical URLs
- Verify article data in Umbraco is complete (author, dates, images)
- Ensure meta descriptions are updated when article content changes

### Schema Updates
If the article data structure changes in Umbraco:
1. Update `generateArticleSchema()` in `seoHelpers.js` to map new fields
2. Test with Schema.org Validator
3. Submit site re-crawl request in Google Search Console

---

## References

- [Schema.org NewsArticle](https://schema.org/NewsArticle)
- [Schema.org BreadcrumbList](https://schema.org/BreadcrumbList)
- [Schema.org Organization](https://schema.org/Organization)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Google Search Central - Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
