import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import formatDate from "../helpers/formatDate";
import getUmbracoMedia from "../api/getUmbracoMedia"; // <-- import the media API
import { buildSrc, buildSrcSet } from "../helpers/image";
import { focalPointToAnchor } from "../helpers/focalPoint";
import { findCropByAlias } from "../helpers/mediaCrops";
import getMediaCrops from "../helpers/getMediaCrops";
import { getPageKey } from "../helpers/page";

const BlogArticleLink = ({
  filter,
  setFilter,
  name,
  authors,
  tags,
  image,
  imageID,
  publishDate,
  introductionText,
  route,
  resultIndex,
  totalResults,
}) => {
  const [topics, setTopics] = useState([]);
  const [mediaData, setMediaData] = useState(null);
  const [mediaCrops, setMediaCrops] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // console.log(route);

  useEffect(() => {
    // match check to mark which topics should be linked
    let blogTopics = window?.setTopics.topics;

    const topics = tags.map((el1) => ({
      name: el1,
      match: blogTopics.some((el2) => el2 === el1),
    }));

    setTopics(topics);
  }, [name, tags]);

  useEffect(() => {
    let mounted = true;
    // Reset mediaData immediately when imageID changes so old image is removed
    setMediaData(null);
    // reset image load state when image changes
    setImgLoaded(false);
    setImgError(false);
    if (!imageID) return undefined;

    setImageLoading(true);
    // Fetch both the full media record and an explicit crops list in parallel.
    // We keep the full media record for url/alt/focalPoint but prefer the
    // `getMediaCrops` result when selecting named crops.
    Promise.allSettled([getUmbracoMedia(imageID), getMediaCrops(imageID)])
      .then(([mediaRes, cropsRes]) => {
        if (!mounted) return;
        const media = mediaRes.status === "fulfilled" ? mediaRes.value : null;
        const crops = cropsRes.status === "fulfilled" ? cropsRes.value : [];
        setMediaData(media);
        setMediaCrops(crops);
      })
      .finally(() => {
        if (!mounted) return;
        setImageLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [imageID]);

  const handleAuthor = (event, item) => {
    event.preventDefault();
    let selectedAuthor = [item];
    setFilter({ ...filter, author: selectedAuthor });
  };

  const handleTopics = (event, item) => {
    event.preventDefault();
    let selectedTopic = [item];
    setFilter({ ...filter, topics: selectedTopic });
  };

  const routePath = (path) => {
    const regex = new RegExp(`/blog(/)?`);
    const result = (path || "").replace(regex, "");
    return result;
  };

  return (
    <div className="wmcads-search-result">
      <h2 className="wmcads-m-b-sm wmcads-search-result__title">
        <Link
          className="h2 wmcads-search-result__title"
          to={{ pathname: `article/${routePath(route)}` }}
          aria-label={
            resultIndex
              ? `${name} — result ${resultIndex} of ${totalResults || ""}`
              : name
          }
        >
          {name}
        </Link>
      </h2>
      <p className="wmcads-search-result__date">
        {authors?.map(function (item, index) {
          return (
            <React.Fragment key={index}>
              {index > 0 && ", "}
              <button
                key={index}
                type="button"
                className="wmcads-link"
                onClick={(e) => handleAuthor(e, item.name)}
                aria-label={`Filter by author ${item.name}`}
              >
                {item.name}
              </button>
            </React.Fragment>
          );
        })}
        {authors?.length > 0 && (
          <>
            &nbsp;-&nbsp;
          </>
        )}
        {formatDate(publishDate)}
            </p>

            <p className="wmcads-search-result__date">
        Topics:{" "}
        {topics?.map(function (item, index) {
          return (
            <React.Fragment key={index}>
              {index > 0 && ", "}
              {/* only link topics selected in the blog post */}
              {item.match ? (
                <button
                  key={`${index}`}
                  type="button"
                  className="wmcads-link"
                  onClick={(e) => handleTopics(e, item.name)}
                  aria-label={`Filter by topic ${item.name}`}
                >
                  {item.name}
                </button>
              ) : (
                <span>{item.name}</span>
              )}
            </React.Fragment>
          );
        })}
      </p>
      {/* Use mediaData if available, otherwise fallback to image */}
      { /* Use picture to offer WebP where supported and provide responsive srcset */ }
      {/* Only render the picture when the image has started loading or mediaData/url exists
          This prevents the previous image from being visible while a new image fetch is in progress */}
      {(mediaData && mediaData.url) || (!imageLoading && image && image !== "No Image") ? (
        (() => {
          // Prefer the named crop 'Banner' when available in the media item's crops.
          // Try both 'Banner' and lowercase 'banner' to be tolerant of alias casing.
          // Prefer crops from the dedicated crops helper when available
          const bannerCrop = (mediaCrops && mediaCrops.length)
            ? (mediaCrops.find((c) => (c.alias || c.name) === "Banner") || mediaCrops.find((c) => (c.alias || c.name) === "banner"))
            : (mediaData ? (findCropByAlias(mediaData, "Banner") || findCropByAlias(mediaData, "banner")) : null);
          // console.log(bannerCrop);
          const url = bannerCrop?.url || mediaData?.url || image;
          const widths = [320, 480, 600];
          const focal = mediaData?.focalPoint || (typeof imageID === "object" ? imageID?.focalPoint : null);
          const anchor = focalPointToAnchor(focal);
          const srcSet = buildSrcSet(url, widths, { height: 250, anchor, mode: "crop" });
          const webpSrcSet = buildSrcSet(url, widths, { height: 250, anchor, mode: "crop", format: "webp" });
          const fallback = buildSrc(url, { width: 600, height: 250, anchor, mode: "crop" });
          const altText = mediaData?.properties?.altText || (typeof imageID === "object" ? imageID?.properties?.altText : "") || "";

          return (
            <div
              className="wmcads-image-wrapper"
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 600,
                marginTop: 16,
                // Reserve space using aspect ratio (600x250)
                  paddingBottom: "41.666667%",
                overflow: "hidden",
              }}
            >
              {/* spinner overlay while loading */}
              {!imgLoaded && !imgError && (
                <div className="wmcads-loader wmcads-loader--small" role="alert" aria-live="assertive">
                  <p className="wmcads-loader__content">Content is loading...</p>
                </div>
              )}

              {/* picture fills reserved space */}
              {!imgError ? (
                <picture style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
                  <source type="image/webp" srcSet={webpSrcSet} sizes="(max-width: 600px) 100vw, 600px" />
                  <source srcSet={srcSet} sizes="(max-width: 600px) 100vw, 600px" />
                  <img
                    key={imageID || getPageKey()}
                    src={fallback}
                    alt={altText}
                    className="wmcads-m-t-md"
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={250}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgError(true)}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </picture>
              ) : (
                <div
                  role="img"
                  aria-label={altText || "Image unavailable"}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#e9e9e9",
                    color: "#666",
                    fontSize: 14,
                  }}
                >
                  Image unavailable
                </div>
              )}
            </div>
          );
        })()
      ) : null}
      <p className="wmcads-search-result__excerpt">{introductionText}</p>
    </div>
  );
};

BlogArticleLink.propTypes = {
  filter: PropTypes.object,
  setFilter: PropTypes.func,
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  authors: PropTypes.array,
  tags: PropTypes.array,
  image: PropTypes.string,
  imageID: PropTypes.string,
  publishDate: PropTypes.string.isRequired,
  introductionText: PropTypes.string,
  route: PropTypes.string,
  resultIndex: PropTypes.number,
  totalResults: PropTypes.number,
};

export default BlogArticleLink;
