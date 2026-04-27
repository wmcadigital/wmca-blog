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
    const proto = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.VERCEL_URL || process.env.NETLIFY_HOST || 'localhost:3000';
    const base = `${proto}://${host}`;
    
    const r = await fetch(`${base}/api/getAuthor?id=${encodeURIComponent(authorName)}`, {
      headers: {
        'User-Agent': 'Next.js ISR',
      },
    });
    
    if (!r.ok) {
      return {
        notFound: true,
        // For Netlify: don't use revalidate
      };
    }
    
    const data = await r.json();
    
    return {
      props: {
        initialAuthor: data,
        authorName,
      },
      // For Netlify: disable ISR revalidate
      revalidate: false, // Disables ISR on static hosts
    };
  } catch (e) {
    console.error(`Error fetching author ${authorName}:`, e);
    return {
      notFound: true,
      revalidate: 60,
    };
  }
}
