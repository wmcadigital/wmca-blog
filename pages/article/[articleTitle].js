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

// For static export: pre-generate all article paths at build time
export async function getStaticPaths() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_UMBRACO_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_UMBRACO_API_KEY;

    if (!apiUrl) {
      console.warn('NEXT_PUBLIC_UMBRACO_API_URL not set, skipping path generation');
      return { paths: [], fallback: 'blocking' };
    }

    const url = new URL(apiUrl);
    url.searchParams.append('$select', 'id,name,createDate,updateDate,properties');
    url.searchParams.append('$take', '500');

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'Api-Key': apiKey } : {}),
      },
    });

    if (!response.ok) {
      console.warn('Failed to fetch articles for paths:', response.status);
      return { paths: [], fallback: 'blocking' };
    }

    const data = await response.json();
    const articles = data.items || [];

    const paths = articles.map(article => ({
      params: { articleTitle: article.name },
    }));

    return {
      paths,
      fallback: 'blocking', // Fallback for new articles added after build
    };
  } catch (error) {
    console.warn('Error generating static paths:', error);
    return { paths: [], fallback: 'blocking' };
  }
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
