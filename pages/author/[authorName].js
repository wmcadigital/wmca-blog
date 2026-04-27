import React from 'react';
import BlogAuthor from '../../src/Blog/BlogAuthor';
import ErrorBoundary from '../../src/helpers/ErrorBoundary';

export default function AuthorPage(props) {
  return (
    <ErrorBoundary>
      {React.createElement(BlogAuthor, props)}
    </ErrorBoundary>
  );
}

export async function getStaticPaths() {
  // Generate paths for authors on demand
  // Use fallback: 'blocking' to generate pages as they're requested
  return {
    paths: [], // No pre-generated paths (can populate from CMS if needed)
    fallback: 'blocking', // Generate page on first request, then cache
  };
}

export async function getStaticProps(context) {
  const { authorName } = context.params;
  
  try {
    // Fetch from internal API route (same host)
    const host = process.env.VERCEL_URL || process.env.NETLIFY_URL || 'localhost:3000';
    // Always use http for localhost (no valid cert), https for real domains
    const proto = host.includes('localhost') ? 'http' : 'https';
    const base = `${proto}://${host}`;
    
    const r = await fetch(`${base}/api/getAuthor?id=${encodeURIComponent(authorName)}`, {
      headers: {
        'User-Agent': 'Next.js ISR',
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
        initialAuthor: data,
        authorName,
      },
      revalidate: 60, // ISR: regenerate every 60 seconds
    };
  } catch (e) {
    console.error(`Error fetching author ${authorName}:`, e);
    return {
      notFound: true,
      revalidate: 60,
    };
  }
}
