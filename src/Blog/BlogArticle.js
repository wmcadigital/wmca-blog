import React from "react";
import { useLoaderData, Link } from "react-router-dom";
import getBlogArticle from "../api/getBlogArticle";
import ScrollToTop from "../helpers/ScrollToTop";
import { useState, useEffect } from "react";
import getUmbracoMedia from "../api/getUmbracoMedia";

import Banner from "./Banner";
import formatDate from "../helpers/formatDate";
import VideoComponent from "./VideoComponent";
import TextComponent from "./TextComponent";
import ImageComponent from "./ImageComponent";
import SidebarCardComponent from "./SidebarCardComponent";
import AccordionComponent from "./AccordionComponent";
import Breadcrumb from "./Breadcrumb";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga4";

export async function loader({ params }) {
  const article = await getBlogArticle(params.articleTitle);
  return { article };
}

const BlogArticle = () => {
  const [articleContentItems, setArticleContentItems] = useState([]);
  const [articleSidebarContentItems, setArticleSidebarContentItems] = useState(
    []
  );
  const [articleAccordionBlockItems, setArticleAccordionBlockItems] = useState(
    []
  );
  const { article } = useLoaderData();
  const [topics, setTopics] = useState([]);

  const SetContent = (data) => {
    switch (data.contentType) {
      case "videoBlock":
        // console.log(data.properties.youtube, 'videoBlock')
        return <VideoComponent url={data.properties.video[0].url} />;
      case "textboxBlock":
        return <TextComponent htmlContent={data.properties.textbox.markup} />;
      case "imageBlock":
        return <ImageComponent imageUrls={data.properties.image} />;
      case "accordionBlock":
        // console.log(data, 'accordionBlock')
        return "<h1>Video Block</h1>";
      default:
        return <h1>Video Block</h1>;
    }
  };

  useEffect(() => {
    // Send pageview with a custom path
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.hash,
      title: article?.name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.title = article.name;
    let accordion = [];

    article?.properties.grid?.items.map((items) => {
      items.content.properties?.content.items.map((items) => {
        if (items.content.contentType === "accordionBlock") {
          accordion.push(items);
        }
      });

      setArticleContentItems(items.content.properties.content.items);
      setArticleSidebarContentItems(items.content.properties?.sidebar?.items);
    });
    setArticleAccordionBlockItems(accordion);
  }, [article]);

  useEffect(() => {
    // match check to mark which topics should be linked
    let blogTopics = window?.setTopics.topics;

    const topics = article.properties.tags.map((el1) => ({
      name: el1,
      match: blogTopics.some((el2) => el2 === el1),
    }));

    setTopics(topics);
  }, [article.properties?.tags]);

  // remove authors from url
  const routePath = (path) => {
    const regex = new RegExp(`/authors(/)?`);
    const result = path.replace(regex, "");
    return result;
  };

  // Component to render an image and fetch alt text from media API when missing
  const ImageWithAlt = ({ img, className = "wmcads-m-t-md", width = 620, height = 300 }) => {
    const [alt, setAlt] = useState(img?.properties?.altText || "");
    const [media, setMedia] = useState(null);

    useEffect(() => {
      let mounted = true;
      if (alt) return () => (mounted = false);

      const mediaId = img?.id || img?.properties?.id;
      if (!mediaId) return () => (mounted = false);

      getUmbracoMedia(mediaId)
        .then((data) => {
          if (!mounted || !data) return;
          setMedia(data);
          const remoteAlt =
            data?.properties?.altText ||
            data?.properties?.alt ||
            data?.name ||
            "";
          if (remoteAlt) setAlt(remoteAlt);
        })
        .catch(() => {
          /* ignore */
        });

      return () => {
        mounted = false;
      };
    }, [img, alt]);

    const src = `https://cms.wmca.org.uk${img?.url}?anchor=center&mode=crop&width=${width}&height=${height}`;
    return <img src={src} alt={alt || media?.name || ""} className={className} />;
  };

  return (
    <>
      <Helmet>
        <title>{article?.name || "WMCA blog"}</title>
      </Helmet>
      <ScrollToTop />
      <Breadcrumb
        article={article.name}
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
      <Banner
        image={window?.setBanner?.bannerimg}
        title={window?.setBanner?.name}
        summary={window?.setBanner?.summary}
        article={true}
      />
      <div className="wmcads-container">
        <main className="wmcads-container--main">
          <div className="wmcads-grid">
            <div className="main wmcads-col-1 wmcads-col-md-2-3 wmcads-m-b-md wmcads-p-r-lg">
              <h1>{article.name}</h1>
              <p className="wmcads-search-result__date">
                {article.properties.author &&
                  article.properties.author.map(function (item, index) {
                    return (
                      <React.Fragment key={item.id || item.name || index}>
                        <Link to={`/?author=${item.name}`}>{item.name}</Link>
                        {index < article.properties.author.length - 1 && ", "}
                      </React.Fragment>
                    );
                  })}
                {article.properties.date != ""
                  ? formatDate(article.properties.date)
                  : null}
              </p>

              {article.properties.hideOpinionMessage != true ? (
                <div className="wmcads-warning-text wmcads-m-t-md wmcads-m-b-md">
                  <svg
                    className="wmcads-warning-text__icon"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use
                      xlinkHref="#wmcads-general-info"
                      href="#wmcads-general-info"
                    ></use>
                  </svg>
                  This blog post is an opinion and may not reflect WMCA’s views.
                </div>
              ) : (
                <div className="wmcads-m-t-md wmcads-m-b-md"></div>
              )}

              {article.properties.introduction != null ? (
                <div className="wmcads-inset-text wmcads-m-b-md">
                  <p>{article.properties.introduction}</p>
                </div>
              ) : null}

              {/*
                Use ImageWithAlt which will call getUmbracoMedia to retrieve alt text when needed.
              */}
              {article.properties.hideImageInBlog != true &&
              article.properties.image != null ? (
                <ImageWithAlt img={article.properties.image[0]} key={article.properties.image[0]?.id || article.properties.image[0]?.url} />
              ) : null}

              {article.properties.copy != null
                ? article.properties.copy.items.map(function (item, index) {
                    if (item.content.contentType == "textboxBlock") {
                      return (
                        <TextComponent
                          key={index}
                          htmlContent={item.content.properties.textbox.markup}
                        />
                      );
                    }

                    if (item.content.contentType == "imageBlock") {
                      const img = item.content.properties.image[0];
                      return <ImageWithAlt key={index} img={img} />;
                    }
                  })
                : null}

              {articleContentItems.map((item, index) => {
                return (
                  item.content.contentType !== "accordionBlock" && (
                    <SetContent key={index} {...item.content} />
                  )
                );
              })}
              <AccordionComponent data={articleAccordionBlockItems} />
              <hr />

              <p>
                Tags:{" "}
                {topics.map(function (item, index) {
                  return (
                    <React.Fragment key={item.name || index}>
                      {index > 0 && ", "}
                      {item.match ? (
                        <Link to={`/?topics=${item.name}`}>{item.name}</Link>
                      ) : (
                        <span>{item.name}</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </p>

              {article?.properties?.author.length !== 0 &&
              article?.properties?.author.length == 1 ? (
                <h2>About the author</h2>
              ) : (
                article?.properties?.author.length !== 0 && <h2>About the authors</h2>
              )}

              {article.properties.author &&
                article.properties.author.map(function (item, index) {
                  return (
                    <div
                      className="wmcads-inset-text wmcads-col-1 wmcads-m-b-md"
                      key={`${index}`}
                    >
                      {item.properties.bio != null ? (
                        <Link
                          className="wmcads-btn wmcads-btn--link"
                          to={{
                            pathname: `/author/${routePath(item.route.path)}`,
                          }}
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <p>
                          <strong>{item.name}</strong>
                        </p>
                      )}

                      {item.properties.jobTitle != null ? (
                        <p className="wmcads-m-t-md">
                          {item.properties.jobTitle}
                        </p>
                      ) : null}

                      {item.properties.twitter != null ||
                      item.properties.linkedin != null ? (
                        <ul className="wmcads-bare-list wmcads-m-t-md">
                          {item.properties.twitter != null ? (
                            <li className="wmcads-m-b-none">
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
                            <li className="wmcads-m-b-none">
                              <a
                                href={item.properties.linkedin[0].url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Linkedin
                              </a>
                            </li>
                          ) : null}

                          {item.properties.facebook != null ? (
                            <li className="wmcads-m-b-none">
                              <a
                                href={item.properties.facebook[0].url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Facebook
                              </a>
                            </li>
                          ) : null}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
            </div>
            <aside className="wmcads-col-1 wmcads-col-md-1-3">
              {articleSidebarContentItems !== undefined &&
                articleSidebarContentItems.map((data, index) => {
                  return (
                    <SidebarCardComponent
                      key={index}
                      {...data.content.properties}
                    />
                  );
                })}
            </aside>
          </div>
        </main>
      </div>
    </>
  );
};

export default BlogArticle;
