import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import formatDate from "../helpers/formatDate";
import getUmbracoMedia from "../api/getUmbracoMedia"; // <-- import the media API

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
    // If imageID exists, fetch media data
    if (imageID) {
      getUmbracoMedia(imageID).then((data) => {
        setMediaData(data);
      });
    }
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
    const result = path.replace(regex, "");
    return result;
  };

  return (
    <div className="wmcads-search-result">
      <h2 className="wmcads-m-b-sm">
        <Link className="h2" to={{ pathname: `article/${routePath(route)}` }}>
          {name}
        </Link>
      </h2>
      <p className="wmcads-search-result__date">
        {authors?.map(function (item, index) {
          return (
            <React.Fragment key={index}>
              {index > 0 && ", "}
              <a
                key={index}
                onClick={(e) => handleAuthor(e, item.name)}
                onKeyUp={handleAuthor}
                role="link"
                tabIndex="0"
              >
                {item.name}
                &nbsp;-&nbsp;
              </a>
            </React.Fragment>
          );
        })}
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
                <a
                  key={`${index}`}
                  onClick={(e) => handleTopics(e, item.name)}
                  onKeyUp={handleTopics}
                  role="link"
                  tabIndex="0"
                >
                  {item.name}
                </a>
              ) : (
                <span>{item.name}</span>
              )}
            </React.Fragment>
          );
        })}
      </p>
      {/* Use mediaData if available, otherwise fallback to image */}
      {mediaData && mediaData.url ? (
        <img
          src={mediaData.url}
          alt={mediaData.name || imageID}
          className="wmcads-m-t-md"
        />
      ) : image !== "No Image" ? (
        <img
          src={`https://cms.wmca.org.uk${image}?anchor=center&mode=crop&width=600&height=250`}
          alt={`${imageID.properties?.altText || ""}`}
          className="wmcads-m-t-md"
        />
      ) : null}
      <p className="wmcads-search-result__excerpt">{introductionText}</p>
    </div>
  );
};

BlogArticleLink.propTypes = {
  filter: PropTypes.object,
  setFilter: PropTypes.func,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  authors: PropTypes.array,
  tags: PropTypes.array,
  image: PropTypes.string,
  imageID: PropTypes.string,
  publishDate: PropTypes.string.isRequired,
  introductionText: PropTypes.string,
  route: PropTypes.string,
};

export default BlogArticleLink;
