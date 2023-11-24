import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

import BlogArticles from "./Blog/BlogArticles";
import BlogArticle, { loader as blogLoader, } from "./Blog/BlogArticle";
import ErrorPage from "./error-page";

// ensure app works on custom content page in cms by using the path location
const pathname = window.location.pathname;

console.log(pathname, 'orign path name')

function removePathIncludingArticle(url) {
  // Use a regular expression to match everything including and after /article
  const regex = /\/article(\/.*)?/;
  
  // Replace the matched part with an empty string
  const result = url.replace(regex, '');
  
  console.log(result, 'new path name')

  return result;
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
    loader: blogLoader,
  },
]
);

root.render(
  <StrictMode>
  <div className="wmcads-container">
    <main className="wmcads-container--main">
      <RouterProvider router={router} />
    </main>
  </div>
  </StrictMode>
);
