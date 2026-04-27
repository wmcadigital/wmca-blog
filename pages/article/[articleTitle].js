import React from 'react';
import BlogArticle from '../../src/Blog/BlogArticle';
import ErrorBoundary from '../../src/helpers/ErrorBoundary';

export default function ArticlePage(props) {
  return (
    <ErrorBoundary>
      {React.createElement(BlogArticle, props)}
    </ErrorBoundary>
  );
}

export async function getStaticPaths() {
  // Generate paths for recent articles at build time
  // Use fallback: 'blocking' for on-demand generation of new articles
  return {
    paths: [], // No pre-generated paths at build time (can be empty or populated from CMS)
    fallback: 'blocking', // Blocking: generate page on first request, then cache
  };
}

export async function getStaticProps(context) {
  const { articleTitle } = context.params;
  
  try {
    // Fetch from internal API route (same host)
    const host = process.env.VERCEL_URL || process.env.NETLIFY_URL || 'localhost:3000';
    // Always use http for localhost (no valid cert), https for real domains
    const proto = host.includes('localhost') ? 'http' : 'https';
    const base = `${proto}://${host}`;
    
    const r = await fetch(`${base}/api/getBlogArticle?id=${encodeURIComponent(articleTitle)}`, {
      headers: {
        'User-Agent': 'Next.js ISR', // Identify as internal request
      },
    });
    
    if (!r.ok) {
      return {
        notFound: true,
        revalidate: 60,
      };
    }
    
    const data = await r.json();
    
    return {
      props: {
        initialArticle: data,
        articleTitle,
      },
      revalidate: 60, // ISR: regenerate every 60 seconds
    };
  } catch (e) {
    console.error(`Error fetching article ${articleTitle}:`, e);
    return {
      notFound: true,
      revalidate: 60, // Retry 404 in 60 seconds
    };
  }
}
