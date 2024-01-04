import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

import BlogArticles from "./Blog/BlogArticles";
import BlogArticle, { loader as blogLoader, } from "./Blog/BlogArticle";
import ErrorPage from "./error-page";

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
      <RouterProvider router={router} />
  </StrictMode>
);
