/* eslint-disable jsx-a11y/interactive-supports-focus */
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import formatDate from "../helpers/formatDate";
// import extractExcerpt from "../helpers/extractExcerpt";

const BlogArticleLink = ({
  filter,
  setFilter,
  name,
  id,
  authors,
  tags,
  image,
  publishDate,
  introductionText,
}) => {
  const handleAuthor = (event, item) => {
    event.preventDefault();

    let selectedAuthor = [item]
    setFilter({ ...filter, author: selectedAuthor });

  };

  const handleTopics = (event, item) => {
    event.preventDefault();

    let selectedTopic = [item]
    setFilter({ ...filter, topics: selectedTopic });
  };

  return (
    <div className="wmcads-search-result">
      <h2 className="wmcads-m-b-sm">
        <Link className="h2" to={`article/${id}`}>
          {name}
        </Link>
      </h2>
      <p className="wmcads-search-result__date">
        {authors?.map(function (item, index) {
          return (
            <a key={`${index}`} onClick={(e) => handleAuthor(e, item.name)} onKeyUp={handleAuthor} role="link">
              {(index ? ", " : "") + item.name}
            </a>
          );
        })} - 
        {formatDate(publishDate)}
      </p>

      <p className="wmcads-search-result__date">
        Topics:{" "}
        {tags?.map(function (item, index) {
          return (
            <a key={`${index}`} onClick={(e) => handleTopics(e, item)} onKeyUp={handleTopics} role="link">
              {(index ? ", " : "") + item}
            </a>
          );
        })}
      </p>

      {image != "No Image" ? (
        <img
          src={`https://app-umbraco-multisite.azurewebsites.net/${image}?anchor=center&mode=crop&width=600&height=250`}
          alt=""
          className="wmcads-m-t-md"
        />
      ) : null}

      <p
        className="wmcads-search-result__excerpt"
      >
        {introductionText}
      </p>
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
  publishDate: PropTypes.string.isRequired,
  introductionText: PropTypes.string.isRequired,
};

export default BlogArticleLink;
