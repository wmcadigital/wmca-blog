import React from "react";
import PropTypes from "prop-types";
import Link from 'next/link';
import { useRouter } from 'next/router';
import getBlogArticle from "../api/getBlogArticle";
import ScrollToTop from "../helpers/ScrollToTop";
import BackToTopButton from "../helpers/BackToTopButton";
import { useState, useEffect, useMemo } from "react";
import getUmbracoMedia from "../api/getUmbracoMedia";
import getMediaCrops from "../helpers/getMediaCrops";
import { findBestCrop } from "../helpers/mediaCrops";
import { buildSrc, buildSrcSet } from "../helpers/image";
import { generateArticleSchema, generateBreadcrumbSchema, generateOrganizationSchema, generateCanonicalUrl } from "../helpers/seoHelpers";

import Banner from "./Banner";
import formatDate from "../helpers/formatDate";
import VideoComponent from "./VideoComponent";
import TextComponent from "./TextComponent";
import ImageComponent from "./ImageComponent";
import SidebarCardComponent from "./SidebarCardComponent";
import AccordionComponent from "./AccordionComponent";
import Breadcrumb from "./Breadcrumb";
import Head from 'next/head';
import { send as analyticsSend } from "../analytics";
import { getPageKey } from "../helpers/page";

// Make loader synchronous to avoid blocking initial render.
// The article will be fetched inside the component so LCP isn't delayed by the route loader.
const BlogArticle = (props) => {
  const router = useRouter();
  
  // Do NOT read `window` during render — initialize to an empty object so
  // server and initial client render match. Populate from `window` only
  // inside a client-only effect to avoid hydration mismatches.
  const [setTopicsGlobal, setSetTopicsGlobal] = useState({});
  const [setBannerGlobal, setSetBannerGlobal] = useState({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.setTopics) setSetTopicsGlobal(window.setTopics);
    if (window.setBanner) setSetBannerGlobal(window.setBanner);

    // Listen for banner/topics updates from the web component
    const handleTopicsUpdate = (ev) => {
      try {
        const detail = ev?.detail || {};
        if (detail.topics !== undefined) {
          setSetTopicsGlobal(prev => ({ ...prev, topics: detail.topics }));
        }
        if (detail.banner !== undefined) {
          setSetBannerGlobal(detail.banner);
        }
        if (detail.breadcrumbs !== undefined) {
          setSetTopicsGlobal(prev => ({ ...prev, breadcrumbs: detail.breadcrumbs }));
        }
        if (detail.name !== undefined) {
          setSetTopicsGlobal(prev => ({ ...prev, name: detail.name }));
        }
        if (detail.page !== undefined) {
          setSetTopicsGlobal(prev => ({ ...prev, page: detail.page }));
        }
        console.debug('[BlogArticle] Received wmca:setTopics event:', detail);
      } catch (e) {
        console.error('[BlogArticle] Error handling wmca:setTopics event:', e);
      }
    };

    window.addEventListener('wmca:setTopics', handleTopicsUpdate);
    return () => window.removeEventListener('wmca:setTopics', handleTopicsUpdate);
  }, []);

  // Listen for route changes to ensure clean unmount when navigating away from article
  useEffect(() => {
    if (!router.isReady) return;

    const handleRouteChangeStart = (url) => {
      // If navigating away from article page, ensure we're not staying visible
      if (!url.startsWith('/article/')) {
        // Trigger any cleanup needed
        if (typeof window !== 'undefined') {
          // Dispatch a custom event so parent components know we're leaving
          window.dispatchEvent(new CustomEvent('article-unmount', { detail: { url } }));
        }
      }
    };

    router.events?.on('routeChangeStart', handleRouteChangeStart);
    
    return () => {
      router.events?.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [router.events, router.isReady]);

  const hasWindow = typeof window !== "undefined";
  // Accept server-provided props: props.initialArticle and props.articleTitle
  const loaderData = props.loaderData || { article: props.initialArticle || null, articleTitle: props.articleTitle || null };
  const [articleData, setArticleData] = useState(loaderData?.article ?? null);
  const articleTitle = loaderData?.articleTitle;

  // alias used throughout the component to minimise other edits
  const article = articleData;

  // Derive content items from article using useMemo to avoid hydration mismatch
  // These are computed synchronously during render, not set by effects
  const { articleContentItems, articleSidebarContentItems, articleAccordionBlockItems } = useMemo(() => {
    if (!article?.properties?.grid?.items) {
      return {
        articleContentItems: [],
        articleSidebarContentItems: [],
        articleAccordionBlockItems: [],
      };
    }

    let contentItems = [];
    let sidebarItems = [];
    let accordionItems = [];

    article.properties.grid.items.forEach((items) => {
      items.content.properties?.content.items?.forEach((item) => {
        if (item.content.contentType === "accordionBlock") {
          accordionItems.push(item);
        }
      });
      contentItems = items.content.properties?.content?.items || [];
      sidebarItems = items.content.properties?.sidebar?.items || [];
    });

    return {
      articleContentItems: contentItems,
      articleSidebarContentItems: sidebarItems,
      articleAccordionBlockItems: accordionItems,
    };
  }, [article?.properties?.grid?.items]);

  // `blogBannerImage` holds the canonical image URL used by meta tags and preload
  const [blogBannerImage, setBlogBannerImage] = useState("https://cloudcdn.wmca.org.uk/img/wmca/wmca-default.png");

  // If loader didn't provide the article, fetch it on the client after initial render
  useEffect(() => {
    if (articleData || !articleTitle) return;
    let mounted = true;
    // defer fetch until after first paint to avoid blocking LCP/network contention
    const rafId = hasWindow && window.requestAnimationFrame
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
      if (rafCleanup.raf && hasWindow && window.cancelAnimationFrame) {
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
        return <VideoComponent url={data.properties.video[0].url} />;
      case "textboxBlock":
        return <TextComponent htmlContent={data.properties.textbox.markup} />;
      case "imageBlock":
        return <ImageComponent imageUrls={data.properties.image} />;
      case "accordionBlock":
        // Handled separately in render, should not reach here
        return null;
      default:
        return null; // Return null for unknown types instead of placeholder
    }
  };

  useEffect(() => {
    // Send pageview with a custom path (client-side only)
    if (typeof window !== "undefined") {
      analyticsSend({
        hitType: "pageview",
        page: window.location.pathname + window.location.hash,
        title: article?.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = article?.name || "Blog Article";
    }
  }, [article?.name]);

  useEffect(() => {
    // match check to mark which topics should be linked
    if (!article?.properties?.tags) return;
    let blogTopics = setTopicsGlobal?.topics || [];

    const topics = article.properties.tags.map((el1) => ({
      name: el1,
      match: blogTopics.some((el2) => el2 === el1),
    }));

    setTopics(topics);
  }, [article?.properties?.tags, setTopicsGlobal?.topics]);

  // Set blog topics to window object for JavaScript access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.blogTopics = topics;
    }
  }, [topics]);

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
    const widths = useMemo(() => [320, 480, 768, width], [width]);
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

  // Extract the first image from article content blocks
  const firstContentImage = useMemo(() => {
    if (!articleContentItems || articleContentItems.length === 0) return null;
    
    for (const item of articleContentItems) {
      if (item.content.contentType === "imageBlock" && item.content.properties?.image) {
        const imageArray = item.content.properties.image;
        if (Array.isArray(imageArray) && imageArray.length > 0) {
          const image = imageArray[0];
          // Return the URL, ensuring it's absolute
          if (typeof image === 'string') return image;
          if (image?.url) return image.url;
        }
      }
    }
    return null;
  }, [articleContentItems]);

  // Use first content image if available, otherwise use banner image
  const blogImg = firstContentImage || blogBannerImage;

  // Generate SEO data
  const baseUrl = hasWindow ? `${window.location.protocol}//${window.location.host}` : "https://www.wmca.org.uk";
  const currentPath = hasWindow ? window.location.pathname : "";
  const canonicalUrl = generateCanonicalUrl(baseUrl, currentPath);
  
  // Generate JSON-LD schemas
  const articleSchema = generateArticleSchema(article, baseUrl, currentPath);
  const breadcrumbItems = setTopicsGlobal?.breadcrumbs?.breadcrumb || [];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems, article?.name);
  const organizationSchema = generateOrganizationSchema();

  const renderContent = () => (
    <>
      <Head>
        <title>{article?.name || 'WMCA blog'}</title>
        
        {/* Preconnect and DNS prefetch for external CDNs to improve font loading */}
        <link rel="preconnect" href="https://cloudcdn.wmca.org.uk" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.wmca.org.uk" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Canonical URL for SEO */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Image preload */}
        {article?.properties?.image && article.properties.image[0] && (
          <link rel="preload" as="image" href={blogImg} crossOrigin="anonymous" />
        )}

        {/* Enhanced meta tags */}
        <meta name="description" content={description || setTopicsGlobal?.summary || 'WMCA blog'} suppressHydrationWarning />
        <meta name="keywords" content={article?.properties?.tags?.map(t => t.trim()).join(', ') || 'WMCA, blog'} />
        <meta name="author" content={article?.properties?.author?.[0]?.name || 'West Midlands Combined Authority'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en-GB" />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={blogImg} />
        <meta property="og:image:alt" content={title} />
        <meta property="og:site_name" content={setBannerGlobal?.name || 'WMCA Blog'} suppressHydrationWarning />
        <meta property="og:locale" content="en_GB" />
        {article?.properties?.createDate && (
          <meta property="article:published_time" content={article.properties.createDate} />
        )}
        {article?.properties?.author && article.properties.author.length > 0 && (
          <meta property="article:author" content={article.properties.author[0].name} />
        )}
        {article?.properties?.tags && article.properties.tags.length > 0 && (
          article.properties.tags.map((tag, idx) => (
            <meta key={idx} property="article:tag" content={tag.trim()} />
          ))
        )}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={blogImg} />
        <meta name="twitter:image:alt" content={title} />

        {/* JSON-LD Structured Data */}
        {articleSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
          />
        )}
        {breadcrumbSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />
        )}
        {organizationSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
        )}
      </Head>
      <ScrollToTop />
      <BackToTopButton />
      <div suppressHydrationWarning>
        <Breadcrumb
          article={article?.name}
          current={setTopicsGlobal?.url}
          name={setTopicsGlobal?.name}
          parent={setTopicsGlobal?.breadcrumbs?.breadcrumb?.[0]}
          parent2={setTopicsGlobal?.breadcrumbs?.breadcrumb?.[1]}
          parent3={setTopicsGlobal?.breadcrumbs?.breadcrumb?.[2]}
          parent4={setTopicsGlobal?.breadcrumbs?.breadcrumb?.[3]}
          parent5={setTopicsGlobal?.breadcrumbs?.breadcrumb?.[4]}
          parent6={setTopicsGlobal?.breadcrumbs?.breadcrumb?.[5]}
          parent7={setTopicsGlobal?.breadcrumbs?.breadcrumb?.[6]}
          parent8={setTopicsGlobal?.breadcrumbs?.breadcrumb?.[7]}
        />
        <Banner
          image={setBannerGlobal?.bannerimg}
          title={setBannerGlobal?.name}
          summary={setBannerGlobal?.summary}
          article={true}
        />
      </div>
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
                            <Link href={`/?author=${item.name}`} aria-label={`Use this link to view all articles by ${item.name}`}>{item.name}</Link>
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
                      This blog post is an opinion and may not reflect WMCA&apos;s views.
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
                // Filter out accordion blocks (they're rendered separately below)
                if (item.content.contentType === "accordionBlock") {
                  return null;
                }
                return <SetContent key={index} {...item.content} />;
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
                        <Link href={`/?topics=${item.name}`}>{item.name}</Link>
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
                        <Link href={`/author/${routePath(item.route.path)}`} className="wmcads-btn wmcads-btn--link" aria-label={`View the profile of ${item.name}`}>{item.name}</Link>
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
