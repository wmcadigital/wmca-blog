/**
 * SEO helpers for structured data (JSON-LD) generation
 * Supports Schema.org formats for better search engine understanding
 */

/**
 * Generate Article schema for JSON-LD
 * @param {Object} article - Article data object
 * @param {string} baseUrl - Base URL of the site
 * @param {string} articlePath - Article path (without domain)
 * @returns {Object} Article schema
 */
export const generateArticleSchema = (article, baseUrl, articlePath) => {
  if (!article) return null;

  const publishDate = article.properties?.createDate || new Date().toISOString();
  const authors = article.properties?.author || [];
  const imageUrl = article.properties?.image?.[0]?.url || 'https://cloudcdn.wmca.org.uk/img/wmca/wmca-default.png';
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `https://cms.wmca.org.uk${imageUrl}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.name,
    description: article.properties?.excerpt || '',
    image: fullImageUrl,
    datePublished: publishDate,
    dateModified: publishDate,
    author: authors.length > 0 ? authors.map(author => ({
      '@type': 'Person',
      name: author.name || 'WMCA',
    })) : [{
      '@type': 'Organization',
      name: 'West Midlands Combined Authority',
    }],
    publisher: {
      '@type': 'Organization',
      name: 'West Midlands Combined Authority',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cloudcdn.wmca.org.uk/img/wmca/wmca-logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}${articlePath}`,
    },
  };
};

/**
 * Generate Breadcrumb schema for JSON-LD
 * @param {Array} breadcrumbs - Breadcrumb items with name and url
 * @param {string} currentTitle - Current page title
 * @returns {Object} Breadcrumb schema
 */
export const generateBreadcrumbSchema = (breadcrumbs = [], currentTitle = '') => {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: '/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: '/blog',
    },
  ];

  // Add topic breadcrumbs if available
  if (breadcrumbs && breadcrumbs.length > 0) {
    breadcrumbs.forEach((breadcrumb) => {
      items.push({
        '@type': 'ListItem',
        position: items.length + 1,
        name: breadcrumb.name,
        item: breadcrumb.url || '#',
      });
    });
  }

  // Add current page if title provided
  if (currentTitle) {
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: currentTitle,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
};

/**
 * Generate Organization schema for JSON-LD
 * @returns {Object} Organization schema
 */
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'West Midlands Combined Authority',
    url: 'https://www.wmca.org.uk',
    logo: 'https://cloudcdn.wmca.org.uk/img/wmca/wmca-logo.png',
    sameAs: [
      'https://www.facebook.com/wmcombined',
      'https://twitter.com/WMCA',
      'https://www.linkedin.com/company/west-midlands-combined-authority',
    ],
  };
};

/**
 * Generate canonical URL for a page
 * @param {string} baseUrl - Base URL of the site
 * @param {string} path - Current page path
 * @returns {string} Canonical URL
 */
export const generateCanonicalUrl = (baseUrl, path) => {
  // Remove query parameters and hash
  const cleanPath = path.split('?')[0].split('#')[0];
  return `${baseUrl}${cleanPath}`;
};
