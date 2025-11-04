import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";

// Code-split route components to reduce initial bundle size and defer
// loading of routes until they're actually navigated to.
const BlogArticles = React.lazy(() => import("./Blog/BlogArticles"));
const BlogArticle = React.lazy(() => import("./Blog/BlogArticle"));
const BlogAuthor = React.lazy(() => import("./Blog/BlogAuthor"));
import ErrorPage from "./error-page";

// Lazy-load analytics only after user interaction or a short timeout so
// analytics code doesn't contribute to unused JS on first load.
import { flush as flushAnalyticsQueue } from "./analytics";

const initAnalytics = async () => {
  try {
    const mod = await import(/* webpackChunkName: "analytics" */ "react-ga4");
    const ReactGA = mod.default ?? mod;
    ReactGA.initialize("G-PL6P8LRKHT");
    // Flush any queued analytics calls now gtag/react-ga4 is available
    try {
      flushAnalyticsQueue();
    } catch (e) {
      /* ignore flush errors */
    }
  } catch (e) {
    // don't block the app if analytics fails to load
    console.debug("Analytics failed to load:", e);
  }
};

if (typeof window !== "undefined") {
  const onFirstInteraction = () => {
    initAnalytics();
    ["click", "keydown", "scroll", "touchstart"].forEach((ev) =>
      window.removeEventListener(ev, onFirstInteraction)
    );
  };
  ["click", "keydown", "scroll", "touchstart"].forEach((ev) =>
    window.addEventListener(ev, onFirstInteraction, { passive: true, once: true })
  );
  // Fallback: init after 5s if no interaction
  setTimeout(() => initAnalytics(), 5000);
}

const container = document.getElementById("root");

const root = createRoot(container);

const router = createHashRouter([
  {
    path: "/",
    element: <BlogArticles />,
    errorElement: <ErrorPage />,
  },
  {
    path: "article/:articleTitle",
    element: <BlogArticle />,
    // Dynamically import the loader when the route is navigated to so data
    // fetching logic isn't bundled into the initial JS.
    loader: async (args) => {
      const mod = await import("./Blog/BlogArticle");
      return mod.loader ? mod.loader(args) : null;
    },
  },
  {
    path: "author/:authorName",
    element: <BlogAuthor />,
    loader: async (args) => {
      const mod = await import("./Blog/BlogAuthor");
      return mod.loader ? mod.loader(args) : null;
    },
  },
], { future: { v7_startTransition: true } });

console.log("v1.0.21");

root.render(
  <StrictMode>
    <Suspense fallback={null}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>
);
