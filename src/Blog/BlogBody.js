import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import formatDate from "../helpers/formatDate";
// import extractExcerpt from "../helpers/extractExcerpt";

const BlogBody = ({
  filter,
  setFilter,
  name,
  authors,
  tags,
  image,
  publishDate,
  introductionText,
}) => {
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
    <a key={index} onClick={handleAuthor}>
      {item.name},&nbsp;
    </a>
  ));

  const renderTags = tags.map((item, index) => (
    <a key={index} onClick={handleTopics}>
      {item},&nbsp;
    </a>
  ));

  return (
    <div className="wmcads-search-result">
      <h2 className="wmcads-m-b-sm">
        <Link className="h2" to={`article/${name}`}>{name}</Link>
      </h2>
      <p className="wmcads-search-result__date">
        {renderAuthors}
        {formatDate(publishDate)}
      </p>

      <p className="wmcads-search-result__date">Topics: {renderTags}</p>

      {image != "No Image" ? (
        <img
          src={`https://cms.wmca.org.uk${image}?anchor=center&mode=crop&width=600&height=250`}
          alt=""
          className="wmcads-m-t-md"
        />
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
  publishDate: PropTypes.string.isRequired,
  introductionText: PropTypes.string.isRequired,
};

export default BlogBody;
