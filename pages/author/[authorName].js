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

// For static export: pre-generate all author paths at build time
export async function getStaticPaths() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_UMBRACO_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_UMBRACO_API_KEY;

    if (!apiUrl) {
      console.warn('NEXT_PUBLIC_UMBRACO_API_URL not set, skipping author path generation');
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
      console.warn('Failed to fetch articles for author paths:', response.status);
      return { paths: [], fallback: 'blocking' };
    }

    const data = await response.json();
    const articles = data.items || [];

    // Extract unique author names from articles
    const authorNames = new Set();
    articles.forEach(article => {
      if (article.properties?.author) {
        const author = article.properties.author;
        if (typeof author === 'string') {
          authorNames.add(author);
        } else if (Array.isArray(author)) {
          author.forEach(a => authorNames.add(a));
        }
      }
    });

    const paths = Array.from(authorNames).map(name => ({
      params: { authorName: name },
    }));

    return {
      paths,
      fallback: 'blocking', // Fallback for new authors
    };
  } catch (error) {
    console.warn('Error generating author paths:', error);
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
