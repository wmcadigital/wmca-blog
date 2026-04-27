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
