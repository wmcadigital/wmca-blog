import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

import BlogArticles from "./Blog/BlogArticles";
import BlogArticle, { loader as blogLoader, } from "./Blog/BlogArticle";
import BlogAuthor, { loader as authorLoader, } from "./Blog/BlogAuthor";
import ErrorPage from "./error-page";
import ReactGA from "react-ga4";

ReactGA.initialize("G-PL6P8LRKHT");

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
  {path: "author/:authorName",
    element: <BlogAuthor />,
    loader: authorLoader,
  },
]
);

console.log('v1.0.16');

root.render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>
);
