/* eslint-disable jsx-a11y/interactive-supports-focus */
import PropTypes from "prop-types";
import React from 'react'
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

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
  route,
}) => {
  const [topics, setTopics] = useState([]);

  const handleAuthor = (event, item) => {
    event.preventDefault();
    let selectedAuthor = [ item ]
    setFilter({...filter, author : selectedAuthor});
  };

  const handleTopics = (event, item) => {
    event.preventDefault();
    let selectedTopic = [ item ]
    setFilter({...filter, topics : selectedTopic});
  };

  const routePath =
      (path) => {
        const regex = new RegExp(`/blog(/)?`);
        const result = path.replace(regex, '');
        return result;
      }

  useEffect(() => {
    // match check to mark which topics should be linked
    let blogTopics = window?.setTopics.topics;

    const topics = tags.map((el1) => ({
                              name : el1,
                              match : blogTopics.some((el2) => el2 === el1),
                            }))

    setTopics(topics);
  }, [ name, tags ]);

  return (
    <div className="wmcads-search-result">
      <h2 className="wmcads-m-b-sm">
        <Link className="h2" to={{
    pathname: `article/${routePath(route)}`}} >
          {name}
        </Link>
      </h2>
      <p className="wmcads-search-result__date">
        {authors?.map(function (item, index) {
    return (<React.Fragment key = {index}>{
        index > 0 &&
        ', '}<a key = {`${index}`} onClick = {(e) => handleAuthor(
                                                  e, item.name)} onKeyUp =
                  {handleAuthor} role = "link">{
        item.name}</a>
            </React.Fragment>);
        })}&nbsp;-&nbsp;
        {formatDate(publishDate)}
      </p>

      <p className="wmcads-search-result__date">
        Topics:{" "}
        {topics?.map(function (item, index) {
          return (
            <React.Fragment key={index}>
              {index > 0 && ', '}
              {/* only link topics selected in the blog post */}
              {item.match ? (
              <a key={`${index}`} onClick={(e) => handleTopics(e, item.name)} onKeyUp={handleTopics} role="link">
                {item.name}
              </a>) : 
              <span>{item.name}</span>
              }
            </React.Fragment>
          );
        })
}
< /p>
      {image != "No Image" ? (
        <img
          src={`https:/ /
        cms.wmca.org.uk${image}
? anchor = center &mode = crop &width = 600 &height = 250 `}
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
  introductionText: PropTypes.string,
  route: PropTypes.string,
};

export default BlogArticleLink;
