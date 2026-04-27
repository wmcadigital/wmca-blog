import React from 'react';
import BlogArticles from '../src/Blog/BlogArticles';
import ErrorBoundary from '../src/helpers/ErrorBoundary';

export default function IndexPage(props) {
  return (
    <ErrorBoundary>
      {React.createElement(BlogArticles, props)}
    </ErrorBoundary>
  );
}
