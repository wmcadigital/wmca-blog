import React from 'react';
import { useEffect } from 'react';
import Router from 'next/router';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import '../src/helpers/bannerStorage'; // Initialize standalone banner utilities

function initAnalytics() {
  try {
    import('react-ga4').then((mod) => {
      const ReactGA = mod.default ?? mod;
      ReactGA.initialize('G-PL6P8LRKHT');
      try {
        const flush = require('../src/analytics').flush;
        if (flush) flush();
      } catch (e) {
        /* ignore */
      }
    });
  } catch (e) {
    // ignore
  }
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  
  useEffect(() => {
    // Listen for messages from the host page when embedded via the web component.
    // The web component will post `{ type: 'wmca:setTopics', payload: { topics, breadcrumbs, name, banner, page } }`.
    const messageHandler = (ev) => {
      try {
        const data = ev?.data || {};
        if (data && data.type === 'wmca:setTopics' && data.payload) {
          // Web component properties take priority - only merge payload values if not already set by web component
          const existingTopics = window.setTopics || {};
          window.setTopics = Object.assign({}, data.payload, existingTopics);
          // Expose banner separately for backwards compatibility with BlogArticles component
          // Only set if banner wasn't already set by web component
          if (data.payload.banner && !window.setBanner) {
            window.setBanner = data.payload.banner;
            // Also persist banner to localStorage for standalone fallback
            try {
              window.localStorage?.setItem('wmca-blog-banner', JSON.stringify(data.payload.banner));
              console.debug('[App] Banner saved to localStorage');
            } catch (e) {
              // ignore localStorage errors
            }
          }
          // notify any listeners inside the app that topics were updated
          try {
            window.dispatchEvent(new CustomEvent('wmca:setTopics', { detail: data.payload }));
          } catch (e) {
            // ignore if CustomEvent not supported
          }
        }
      } catch (e) {
        // ignore malformed messages
      }
    };
    window.addEventListener('message', messageHandler);
    // Bridge Next.js router events to a simple window event so in-app
    // components (including the list page) can react to route changes
    const routeHandler = (url) => {
      try {
        window.dispatchEvent(new CustomEvent('wmca:routeChange', { detail: { url } }));
        // When embedded in an outer page, notify the parent so it can
        // manage history entries (allowing the browser back button to
        // return from an article to the list when embedded).
        try {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'wmca:navigation', url }, '*');
          }
        } catch (e) {
          // ignore postMessage failures
        }
      } catch (e) {
        // ignore
      }
    };
    Router.events.on('routeChangeComplete', routeHandler);
    const handlePopState = () => {
      window.location.reload();
    };
    window.addEventListener('popstate', handlePopState);
    const onFirstInteraction = () => {
      initAnalytics();
      ['click', 'keydown', 'scroll', 'touchstart'].forEach((ev) =>
        window.removeEventListener(ev, onFirstInteraction)
      );
    };
    ['click', 'keydown', 'scroll', 'touchstart'].forEach((ev) =>
      window.addEventListener(ev, onFirstInteraction, { passive: true, once: true })
    );
    const t = setTimeout(() => initAnalytics(), 5000);
    return () => {
      clearTimeout(t);
      window.removeEventListener('message', messageHandler);
      window.removeEventListener('popstate', handlePopState);
      Router.events.off('routeChangeComplete', routeHandler);
    };
  }, []);

  return (
    <>
      <Component key={router.asPath} {...pageProps} />
    </>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
