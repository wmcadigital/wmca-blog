import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import BlogArticles from "./Blog/BlogArticles";
import BlogArticle, { loader as blogLoader, } from "./Blog/BlogArticle";
import ErrorPage from "./error-page";

const container = document.getElementById("root");

const root = createRoot(container);

const router = createBrowserRouter([
  {
    path: "/",
    element: <BlogArticles />,
    errorElement: <ErrorPage />,
  },
  {
    path: "article/:articleId",
    element: <BlogArticle />,
    loader: blogLoader,
  },
]);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
