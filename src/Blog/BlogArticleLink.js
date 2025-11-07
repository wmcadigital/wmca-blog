import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import formatDate from "../helpers/formatDate";
import getUmbracoMedia from "../api/getUmbracoMedia"; // <-- import the media API
import { buildSrc, buildSrcSet } from "../helpers/image";
import { focalPointToAnchor } from "../helpers/focalPoint";
import { findCropByAlias } from "../helpers/mediaCrops";
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
}) => {
  const [topics, setTopics] = useState([]);
  const [mediaData, setMediaData] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

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
    if (!imageID) return undefined;

    setImageLoading(true);
    getUmbracoMedia(imageID)
      .then((data) => {
        if (!mounted) return;
        setMediaData(data);
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
        <Link className="h2 wmcads-search-result__title" to={{ pathname: `article/${routePath(route)}` }}>
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
          const bannerCrop = mediaData ? (findCropByAlias(mediaData, "Banner") || findCropByAlias(mediaData, "banner")) : null;
          console.log(bannerCrop);
          const url = bannerCrop?.url || mediaData?.url || image;
          const widths = [320, 480, 600];
          const focal = mediaData?.focalPoint || (typeof imageID === "object" ? imageID?.focalPoint : null);
          const anchor = focalPointToAnchor(focal);
          const srcSet = buildSrcSet(url, widths, { height: 250, anchor, mode: "crop" });
          const webpSrcSet = buildSrcSet(url, widths, { height: 250, anchor, mode: "crop", format: "webp" });
          const fallback = buildSrc(url, { width: 600, height: 250, anchor, mode: "crop" });
          const altText = mediaData?.properties?.altText || (typeof imageID === "object" ? imageID?.properties?.altText : "") || "";

          return (
            <picture>
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
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </picture>
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
};

export default BlogArticleLink;
