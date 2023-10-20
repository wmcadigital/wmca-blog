import { useLoaderData, Link } from "react-router-dom";
import getBlogArticle from "../api/getBlogArticle";
import ScrollToTop from "../helpers/ScrollToTop";

// import BlogBody from "./BlogBody";

import formatDate from "../helpers/formatDate";

export async function loader({ params }) {
  const article = await getBlogArticle(params.articleId);
  return { article };
}

const BlogArticle = () => {
  const { article } = useLoaderData();

  return (
    <>
    <ScrollToTop />
    <main id="wmcads-main-content" className="wmcads-container wmcads-m-t-lg">
      {/* {loading ? (
        <div className="wmcads-loader wmcads-loader--small wmcads-m-l-xs"></div>
      ) : (
        <h1>{article.name}</h1>
      )} */}

      <div className="wmcads-grid">
        <div className="main wmcads-col-1 wmcads-col-md-2-3 wmcads-m-b-xl wmcads-p-r-lg">
          <h1>{article.name}</h1>
          <p className="wmcads-search-result__date">
            {article.properties.author.map(function (item, index) {
              return (
                <Link to={`/?author=${item.name}`} key={`demo_snap_${index}`}>
                  {(index ? ", " : "") + item.name}
                </Link>
              );
            })}
            ,{" "}
            {article.properties.date != ""
              ? formatDate(article.properties.date)
              : null}{" "}
            -{" "}
            {article.properties.tags.map(function (item, index) {
              return (
                <Link to={`/?topics=${item}`} key={`demo_snap_${index}`}>{(index ? ", " : "") + item}here</Link>
              );
            })}
          </p>

          <div className="wmcads-warning-text wmcads-m-t-md wmcads-m-b-md">
            <svg className="wmcads-warning-text__icon">
              <use
                xlinkHref="#wmcads-general-info"
                href="#wmcads-general-info"
              ></use>
            </svg>
            This blog post is an opinion and may not reflect WMCA’s views.
          </div>

          <div className="wmcads-inset-text" aria-label="Introduction">
            <p>{article.properties.introduction}</p>
          </div>

          {article.properties.image != null ? (
            <img
              src={`https://localhost:44353${article.properties.image[0].url}?anchor=center&mode=crop&width=620&height=300`}
              alt={article.properties.image[0].properties.altText}
              className="wmcads-m-t-md"
            />
          ) : null}

          {article.properties.copy != null
            ? article.properties.copy.items.map(function (item, index) {
                if (item.content.contentType == "textboxBlock") {
                  const aricleCopy = {
                    __html: item.content.properties.textbox.markup,
                  };
                  return (
                    <div
                      key={`${index}`}
                      dangerouslySetInnerHTML={aricleCopy}
                    ></div>
                  );
                }

                if (item.content.contentType == "imageBlock") {
                  const imgSrc = item.content.properties.image[0].url;
                  const imgAlt = item.content.properties.image[0].properties.altText;
                  return (
                    <img
                      key={`${index}`}
                      src={`https://localhost:44353${imgSrc}?anchor=center&mode=crop&width=620&height=300`}
                      alt={imgAlt}
                    />
                  );
                }
              })
            : null}

          {/* <BlogBody
        key="0"
        filter="null"
        setFilter="null"
        name={blogArticle.name}
        authors={blogArticle.properties.author}
        tags={blogArticle.properties.tags}
        image="No Image"
        publishDate={blogArticle.createDate}
        introductionText={blogArticle.properties}
      /> */}

          <hr />

          <p>
            Tags:{" "}
            {article.properties.tags.map(function (item, index) {
              return (
                <a key={`demo_snap_${index}`}>{(index ? ", " : "") + item}</a>
              );
            })}
          </p>

          {article.properties.author.length == 1 ? (
            <h2>About the author</h2>
          ) : (
            <h2>About the authors</h2>
          )}

          {article.properties.author.map(function (item, index) {
            return (
              <div
                className="wmcads-inset-text wmcads-col-1 wmcads-m-b-md"
                aria-label="About the author"
                key={`${index}`}
              >
                {item.name != null ? <p>{item.name}</p> : null}

                {item.properties.jobTitle != null ? (
                  <p>{item.properties.jobTitle}</p>
                ) : null}

                {item.properties.twitter != null ||
                item.properties.linkedin != null ? (
                  <ul className="wmcads-bare-list">
                    {item.properties.twitter != null ? (
                      <li>
                        <a
                          href={item.properties.twitter[0].url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Twitter
                        </a>
                      </li>
                    ) : null}

                    {item.properties.linkedin != null ? (
                      <li>
                        <a
                          href={item.properties.linkedin[0].url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Linkedin
                        </a>
                      </li>
                    ) : null}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </main>
    </>
  );
};

export default BlogArticle;
