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

// For static export: don't generate paths at build time
// The page will be rendered client-side by Next.js router
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: false, // Render statically, let client-side router handle it
  };
}

// Skip getStaticProps for dynamic routes in static export
// Data will be fetched client-side
export async function getStaticProps() {
  // Return empty props - all data is fetched client-side
  return {
    props: {},
    revalidate: false,
  };
}
    
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
