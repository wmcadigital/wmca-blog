import React from "react";
import PropTypes from "prop-types";
import { useLoaderData, Link } from "react-router-dom";
import getBlogArticle from "../api/getBlogArticle";
import ScrollToTop from "../helpers/ScrollToTop";
import { useState, useEffect } from "react";
import getUmbracoMedia from "../api/getUmbracoMedia";
import getMediaCrops from "../helpers/getMediaCrops";
import { findBestCrop } from "../helpers/mediaCrops";
import { buildSrc, buildSrcSet } from "../helpers/image";

import Banner from "./Banner";
import formatDate from "../helpers/formatDate";
import VideoComponent from "./VideoComponent";
import TextComponent from "./TextComponent";
import ImageComponent from "./ImageComponent";
import SidebarCardComponent from "./SidebarCardComponent";
import AccordionComponent from "./AccordionComponent";
import Breadcrumb from "./Breadcrumb";
import Helmet from "react-helmet";
import { send as analyticsSend } from "../analytics";
import { getPageKey } from "../helpers/page";

// Make loader synchronous to avoid blocking initial render.
// The article will be fetched inside the component so LCP isn't delayed by the route loader.
export function loader({ params }) {
  return { article: null, articleTitle: params.articleTitle };
}

const BlogArticle = () => {
  const [articleContentItems, setArticleContentItems] = useState([]);
  const [articleSidebarContentItems, setArticleSidebarContentItems] = useState(
    []
  );
  const [articleAccordionBlockItems, setArticleAccordionBlockItems] = useState(
    []
  );
  const loaderData = useLoaderData();
  // keep local article state; start with loader-provided article (may be null)
  const [articleData, setArticleData] = useState(loaderData?.article ?? null);
  const articleTitle = loaderData?.articleTitle;

  // alias used throughout the component to minimise other edits
  const article = articleData;

  // `blogBannerImage` holds the canonical image URL used by meta tags and preload
  const [blogBannerImage, setBlogBannerImage] = useState("https://cloudcdn.wmca.org.uk/img/wmca/wmca-default.png");

  // If loader didn't provide the article, fetch it on the client after initial render
  useEffect(() => {
    if (articleData || !articleTitle) return;
    let mounted = true;
    // defer fetch until after first paint to avoid blocking LCP/network contention
    const rafId = window.requestAnimationFrame
      ? window.requestAnimationFrame(() => {
          // small timeout to ensure paint
          const t = setTimeout(() => {
            getBlogArticle(articleTitle)
              .then((a) => {
                if (!mounted) return;
                setArticleData(a);
              })
              .catch(() => {})
              .finally(() => {});
          }, 0);
          // store timeout id to allow cleanup
          rafCleanup.timeout = t;
        })
      : (rafCleanup.timeout = setTimeout(() => {
          getBlogArticle(articleTitle)
            .then((a) => {
              if (!mounted) return;
              setArticleData(a);
            })
            .catch(() => {})
            .finally(() => {});
        }, 0));

    const rafCleanup = { timeout: null, raf: rafId };

    return () => {
      mounted = false;
      if (rafCleanup.raf && window.cancelAnimationFrame) {
        window.cancelAnimationFrame(rafCleanup.raf);
      }
      if (rafCleanup.timeout) clearTimeout(rafCleanup.timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleTitle]);
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
    analyticsSend({
      hitType: "pageview",
      page: window.location.pathname + window.location.hash,
      title: article?.name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!article) return; // wait for article to be available
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
    if (!article?.properties?.tags) return;
    let blogTopics = window?.setTopics.topics;

    const topics = article.properties.tags.map((el1) => ({
      name: el1,
      match: blogTopics.some((el2) => el2 === el1),
    }));

    setTopics(topics);
  }, [article?.properties?.tags]);

  // remove authors from url
  const routePath = (path) => {
    const regex = new RegExp(`/authors(/)?`);
    const result = path.replace(regex, "");
    return result;
  };

  // Component to render an image and fetch alt text from media API when missing
  const ImageWithAlt = ({
    img,
    className = "wmcads-m-t-md",
    width = 620,
    height = 300,
  }) => {
    const [alt, setAlt] = useState(img?.properties?.altText || "");
    const [media, setMedia] = useState(null);
    const [crops, setCrops] = useState([]);

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
            data?.properties?.altText || data?.properties?.alt || "";
          if (remoteAlt) setAlt(remoteAlt);
        })
        .catch(() => {
          /* ignore */
        });

      return () => {
        mounted = false;
      };
    }, [img, alt]);

    // Fetch crops (using the new helper) whenever the image changes.
    useEffect(() => {
      let mounted = true;
      async function loadCrops() {
        if (!img) {
          if (mounted) setCrops([]);
          return;
        }
        try {
          const result = await getMediaCrops(img);
          if (!mounted) return;
          setCrops(result || []);
        } catch (e) {
          if (mounted) setCrops([]);
        }
      }
      loadCrops();
      return () => {
        mounted = false;
      };
    }, [img]);

    // Prefer a named Banner crop, otherwise pick the best crop for the
    // target dimensions, otherwise fall back to the raw media URL.
    const bannerCrop = crops && crops.length
      ? (crops.find((c) => (c.alias || c.name) === "Banner") || crops.find((c) => (c.alias || c.name) === "banner"))
      : null;

    const bestCrop = findBestCrop({ crops }, { targetWidth: width, targetHeight: height }) || null;
    const sourceUrl = bannerCrop?.url || bestCrop?.url || img?.url || (typeof img === "string" ? img : "");
    const focalPoint = img?.focalPoint ? `${img.focalPoint.left},${img.focalPoint.top}` : "0,0";
    const widths = [320, 480, 768, width];
    const heightRatio = height / width;
    const srcSet = buildSrcSet(sourceUrl, widths, { heightRatio, anchor: focalPoint, mode: "crop" });
    const webpSrcSet = buildSrcSet(sourceUrl, widths, { heightRatio, anchor: focalPoint, mode: "crop", format: "webp" });
    const fallback = buildSrc(sourceUrl, { width, height, anchor: focalPoint, mode: "crop" });

    // Update the parent banner canonical URL after render. Use the largest
    // requested width as the canonical href (suitable for meta tags and preload).
    useEffect(() => {
      if (!srcSet) return;
      const maxWidth = Math.max(...widths);
      const href = buildSrc(sourceUrl, { width: maxWidth, height: Math.round(maxWidth * heightRatio), anchor: focalPoint, mode: "crop" });
      setBlogBannerImage(href);
    }, [focalPoint, heightRatio, sourceUrl, srcSet, widths]);

    return (
      <picture>
        <source type="image/webp" srcSet={webpSrcSet} sizes="(max-width: 620px) 100vw, 620px" />
        <source srcSet={srcSet} sizes="(max-width: 620px) 100vw, 620px" />
        <img
          key={getPageKey()}
          src={fallback}
          srcSet={srcSet}
          sizes="(max-width: 620px) 100vw, 620px"
          alt={
            // prefer explicit alt from the image prop, otherwise fall back to values from the Umbraco media record
            alt || media?.properties?.altText || media?.properties?.alt || ""
          }
          className={className}
          width={width}
          height={height}
          loading="eager" /* LCP image should not be lazy-loaded */
          // eslint-disable-next-line react/no-unknown-property
          fetchpriority="high"
          decoding="async"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </picture>
    );
  };

  ImageWithAlt.propTypes = {
    img: PropTypes.object.isRequired,
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
  };


  const title = article?.name || "WMCA blog";
  const description = article?.properties?.introduction || "";
  const url = window.location.href;
  const blogImg = blogBannerImage;

  const renderContent = () => (
    <>
      <Helmet>
        <title>{article?.name || "WMCA blog"}</title>
        {/* Preload article image for better performance and to ensure it's available for social cards, but only if it's not the default placeholder image to avoid unnecessary requests and broken images in social cards */}
        {article?.properties?.image &&
          article.properties.image[0] &&
          (() => {
            return (
              <link
                rel="preload"
                as="image"
                href={blogImg}
                crossOrigin="anonymous"
              />
            );
          })()}

        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={blogImg} />

        <meta property="og:site_name" content={window?.setBanner?.name} />
        <meta property="og:locale" content="en_GB" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={blogImg} />
      </Helmet>
      <ScrollToTop />
      <Breadcrumb
        article={article?.name}
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
        <main
          id="wmcads-main-content"
          className="wmcads-container--main"
          tabIndex={-1}
          role="main"
        >
          <div className="wmcads-grid">
            <div className="main wmcads-col-1 wmcads-col-md-2-3 wmcads-m-b-md wmcads-p-r-lg">
              <h1>{article?.name}</h1>
              <p className="wmcads-search-result__date wmcads-m-b-">
                {article?.properties?.author &&
                  article?.properties?.author.map(function (item, index) {
                    const authorCount =
                      article?.properties?.author?.length ?? 0;
                    return (
                      <React.Fragment key={item.id || item.name || index}>
                        <Link
                          to={`/?author=${item.name}`}
                          aria-label={`Use this link to view all articles by ${item.name}`}
                        >
                          {item.name}
                        </Link>
                        {index < authorCount - 1 && ", "}
                      </React.Fragment>
                    );
                  })}
                {article?.properties?.author && article.properties.author.length > 0 ? (
                  <>
                    &nbsp;-&nbsp;
                  </>
                ) : null}
                {article?.properties?.date != ""
                  ? formatDate(article?.properties?.date)
                  : null}
              </p>

              {article?.properties?.author && article.properties.author.length > 0 ? (
                <>
                  {article?.properties?.hideOpinionMessage != true ? (
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
                      This blog post is an opinion and may not reflect WMCA's views.
                    </div>
                  ) : (
                    <div className="wmcads-m-t-md wmcads-m-b-md"></div>
                  )}

                  {article?.properties?.introduction != null ? (
                    <div className="wmcads-inset-text wmcads-m-b-md">
                      <p>{article?.properties?.introduction}</p>
                    </div>
                  ) : null}
                </>
              ) : null}

              {article?.properties?.hideImageInBlog != true &&
              article?.properties?.image != null ? (
                <ImageWithAlt
                  img={article?.properties?.image[0]}
                  key={
                    article?.properties?.image[0]?.id ||
                    article?.properties?.image[0]?.url
                  }
                />
              ) : null}

              {article?.properties?.copy != null
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

              {(() => {
                const authorCount = article?.properties?.author?.length ?? 0;
                if (authorCount === 0) return null;
                return authorCount === 1 ? (
                  <h2>About the author</h2>
                ) : (
                  <h2>About the authors</h2>
                );
              })()}

              {article?.properties?.author &&
                article?.properties?.author.map(function (item, index) {
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
                          aria-label={`View the profile of ${item.name}`}
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

  return renderContent();
};

export default BlogArticle;
