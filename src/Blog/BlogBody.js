import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import formatDate from "../helpers/formatDate";
import getUmbracoMedia from "../api/getUmbracoMedia";
import { getPageKey } from "../helpers/page";

const BlogBody = ({
  filter,
  setFilter,
  name,
  authors,
  tags,
  image,
  imageID, // added imageID prop
  publishDate,
  introductionText,
}) => {
  const [mediaData, setMediaData] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (imageID) {
      getUmbracoMedia(imageID)
        .then((data) => {
          if (mounted) setMediaData(data);
        })
        .catch(() => {
          if (mounted) setMediaData(null);
        });
    }
    return () => {
      mounted = false;
    };
  }, [imageID]);

  const handleAuthor = (event) => {
    event.preventDefault();
    let desiredValue = (fruits_quantity, desired_key) => {
      let desiredValue = fruits_quantity.map((element) => element[desired_key]);
      return desiredValue;
    };
    let desired_key = "name";
    let result = desiredValue(authors, desired_key);

    setFilter({ ...filter, author: result });
  };

  const handleTopics = (event) => {
    event.preventDefault();
    setFilter({ ...filter, categories: tags });
  };

  const renderAuthors = authors.map((item, index) => (
    <button
      key={index}
      type="button"
      className="wmcads-link"
      onClick={handleAuthor}
      aria-label={`Filter by author ${item.name}`}
    >
      {item.name}{index < authors.length - 1 ? ',' : ''}&nbsp;
    </button>
  ));

  const renderTags = tags.map((item, index) => (
    <button
      key={index}
      type="button"
      className="wmcads-link"
      onClick={handleTopics}
      aria-label={`Filter by topic ${item}`}
    >
      {item}{index < tags.length - 1 ? ',' : ''}&nbsp;
    </button>
  ));

  return (
    <div className="wmcads-search-result">
      <h2 className="wmcads-m-b-sm">
        <Link className="h2" to={`article/${name}`}>
          {name}
        </Link>
      </h2>
      <p className="wmcads-search-result__date">
        {renderAuthors}
        {formatDate(publishDate)}
      </p>

      <p className="wmcads-search-result__date">Topics: {renderTags}</p>

      {image != "No Image" || mediaData?.url ? (
        (() => {
          const url = mediaData?.url || image;
          const base = `https://cms.wmca.org.uk${url}`;
          const widths = [320, 480, 600];
          const srcSet = widths.map((w) => `${base}?anchor=center&mode=crop&width=${w}&height=${Math.round((w * 250) / 600)} ${w}w`).join(", ");
          const webpSrcSet = widths.map((w) => `${base}?anchor=center&mode=crop&width=${w}&height=${Math.round((w * 250) / 600)} ${w}w`).join(", ");
          const fallback = `${base}?anchor=center&mode=crop&width=600&height=250`;
          return (
            <picture>
              <source type="image/webp" srcSet={webpSrcSet} sizes="(max-width: 600px) 100vw, 600px" />
              <source srcSet={srcSet} sizes="(max-width: 600px) 100vw, 600px" />
              <img
                key={getPageKey()}
                src={fallback}
                alt={mediaData?.properties?.altText || ""}
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

      <p
        className="wmcads-search-result__excerpt"
        // dangerouslySetInnerHTML={introductionText}
      >
        {introductionText}
      </p>
    </div>
  );
};

BlogBody.propTypes = {
  filter: PropTypes.object,
  setFilter: PropTypes.func,
  name: PropTypes.string.isRequired,
  authors: PropTypes.array,
  tags: PropTypes.array,
  image: PropTypes.string,
  imageID: PropTypes.string, // added propType
  publishDate: PropTypes.string.isRequired,
  introductionText: PropTypes.string.isRequired,
};

export default BlogBody;
