import { chunk } from "lodash";
import React from "react";
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { Helmet } from "react-helmet";
import { Link, useLoaderData } from "react-router-dom";

import getAuthor from "../api/getAuthor";
import getAuthorArticles from "../api/getAuthorArticles";
import formatDate from "../helpers/formatDate";
import getBlogArticleTopics from "../helpers/getBlogArticleTopics";
import ScrollToTop from "../helpers/ScrollToTop";
import sortBlogArticles from "../helpers/sortBlogArticles";

import Breadcrumb from "./Breadcrumb";

export async function loader({ params }) {
  const author = await getAuthor(params.authorName);
  return { author };
}

const BlogAuthor = () => {
  const [authorArticles, setAuthorArticles] = useState([]);
  const { author } = useLoaderData();

  const routePathArticle = (path) => {
    const regex = new RegExp(`/blog(/)?`);
    const result = path.replace(regex, "");
    return result;
  };

  function formatAuthorFilterUrl(path) {
    const regex = new RegExp(`/authors(/)?`);
    const result = path.replace(regex, "");
    const capitalized = result
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-");
    const data = capitalized.replace(/-/g, "+");
    return data;
  }

  const getAuthorsArticles = async () => {
    const response = await getAuthorArticles(author.id);
    let returnedBlogArticles = response?.items ?? [];

    let blogTopics =
      window?.setTopics.topics ?? getBlogArticleTopics(returnedBlogArticles);

    if (typeof blogTopics === "string") {
      blogTopics = JSON.parse(blogTopics);
    }

    returnedBlogArticles = returnedBlogArticles.filter((prop) =>
      prop.properties.tags.some((tags) => blogTopics.includes(tags)),
    );

    // Sort the data by date in descending order
    setAuthorArticles(
      chunk(sortBlogArticles(returnedBlogArticles, "descending"), 4),
    );
  };

  useEffect(() => {
    getAuthorsArticles();
  }, []);

  useEffect(() => {
    // Send pageview with a custom path
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.hash,
      //title: author?.name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>{author.name || "WMCA blog"}</title>
      </Helmet>
      <ScrollToTop />
      <Breadcrumb
        current={window?.setTopics?.url}
        name={window?.setTopics?.name}
        parent={window?.setTopics?.breadcrumbs?.breadcrumb[0]}
        parent2={window?.setTopics?.breadcrumbs?.breadcrumb[1]}
        parent3={window?.setTopics?.breadcrumbs?.breadcrumb[2]}
        parent4={window?.setTopics?.breadcrumbs?.breadcrumb[3]}
        parent5={window?.setTopics?.breadcrumbs?.breadcrumb[4]}
        parent6={window?.setTopics?.breadcrumbs?.breadcrumb[5]}
        parent7={window?.setTopics?.breadcrumbs?.breadcrumb[6]}
        parent8={window?.setTopics?.breadcrumbs?.breadcrumb[7]}
      />

      <div className="wmcads-container">
        <main className="wmcads-container--main">
          {author == "Not found" ? (
            <>
              <h1>Author Not Found</h1>
              <a href="/">Return to blog</a>
            </>
          ) : (
            <div className="wmcads-grid">
              <div className="wmcads-banner-container wmcads-col-1 wmcads-col-md-2-3 wmcads-m-b-md wmcads-md-p-r-lg">
                <>
                  <div className="wmcads-float-left wmcads-col-1 wmcads-col-sm-1-4 wmcads-m-r-lg">
                    {author.properties?.image !== null ? (
                      <img
                        alt={author.name}
                        src={`https://cms-stg.wmca.org.uk${author.properties?.image[0].url}`}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                  {/* {author.properties?.image !== null && <img alt={author.name} src={`https://cms-stg.wmca.org.uk${author.properties?.image[0].url}`}/>} */}
                  <div className="wmcads-float-left">
                    {author.name && (
                      <h1 className="wmcads-m-b-sm">{author.name}</h1>
                    )}
                    {author.properties?.jobTitle !== null ? (
                      <strong>{author.properties?.jobTitle}</strong>
                    ) : (
                      <></>
                    )}
                  </div>
                </>
              </div>
              <div className="main wmcads-col-1 wmcads-col-md-2-3 wmcads-m-b-md wmcads-p-r-lg">
                <>
                  {author.properties?.bio !== null ? (
                    <div
                      className="wmcads-col-1"
                      dangerouslySetInnerHTML={{
                        __html: author.properties?.bio.markup,
                      }}
                    />
                  ) : (
                    <></>
                  )}
                </>
              </div>
              {authorArticles[0]?.length ? (
                <div className="wmcads-col-1 wmcads-col-md-2-3">
                  {author.name && (
                    <h2>Recent articles written by {author.name}</h2>
                  )}

                  <div className="wmcads-css-grid-3-col">
                    <>
                      {authorArticles[0]?.map((article, index) => (
                        <>
                          <div className="wmcads-content-card wmcads-content-card--news">
                            {article.properties.image && (
                              <img
                                alt={article.properties.image[0].name}
                                src={`https://cms.wmca.org.uk${article.properties.image[0].url}?anchor=center&mode=crop&width=600&height=250`}
                              ></img>
                            )}
                            <p>{formatDate(article.properties.date)}</p>
                            <Link
                              to={{
                                pathname: `/article/${routePathArticle(article.route.path)}`,
                              }}
                            >
                              {article.name}
                            </Link>
                          </div>
                        </>
                      ))}
                    </>
                  </div>
                  {author.name && (
                    <>
                      <Link
                        className="wmcads-link wmcads-m-t-lg"
                        to={{
                          pathname: `/`,
                          search: `?sort=descending&topics=&author=${formatAuthorFilterUrl(author.route.path)}&dates=null&dateRangeSet=undefined`,
                        }}
                      >
                        View more posts written by {author.name}
                      </Link>
                    </>
                  )}
                </div>
              ) : null}

              {/* Check to not display this div unless there is at least one child list item */}
              {author.properties?.facebook ||
              author.properties?.linkedin ||
              author.properties?.twitter !== null ? (
                <>
                  <div className="wmcads-col-1 wmcads-col-md-2-3 wmcads-m-t-lg">
                    {author.name && (
                      <h3>Follow {author.name} on social media</h3>
                    )}
                    <ul>
                      {author.properties?.facebook !== null ? (
                        <li>
                          <a
                            href={author.properties?.facebook[0].url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Facebook
                          </a>
                        </li>
                      ) : (
                        <></>
                      )}
                      {author.properties?.linkedin !== null ? (
                        <li>
                          <a
                            href={author.properties?.linkedin[0].url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            LinkedIn
                          </a>
                        </li>
                      ) : (
                        <></>
                      )}
                      {author.properties?.twitter !== null ? (
                        <li>
                          <a
                            href={author.properties?.twitter[0].url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Twitter
                          </a>
                        </li>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default BlogAuthor;
