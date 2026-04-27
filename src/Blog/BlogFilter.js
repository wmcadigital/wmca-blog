import PropTypes from "prop-types";
import React, { useCallback, useMemo } from "react";

import FilterAccordion from "./FilterAccordion";

import { getSearchParam } from "../helpers/urlSearchParams";

import filterBlogArticlesByDate from "../helpers/filterBlogArticlesByDate";
import filterBlogArticlesByTopic from "../helpers/filterBlogArticlesByTopic";
import filterBlogArticlesByAuthor from "../helpers/filterBlogArticlesByAuthor";

if (getSearchParam("author")) {
  // console.log('url has authors');
}

const BlogFilter = ({
  returnedBlogArticles = [],
  filter = { sort: "", topics: [], author: [], dates: null },
  clearFilters = false,
  setFilter = () => {},
  setClearFilters = () => {},
  noOfResults = 0,
  showFilterOverrideMobile = false,
  setShowFilterOverrideMobile = () => {},
  blogCategories = [],
  setDateRanges = () => {},
  topicsGlobal = {},
}) => {
  const dates = useMemo(() => {
    // Start with all returned articles and apply the same topic/author filtering
    // pipeline used by BlogArticles so the availability calculation matches
    // what users will actually see.
    let articlesForDateCheck = Array.isArray(returnedBlogArticles)
      ? [...returnedBlogArticles]
      : [];

    // Apply global topics configuration (from web component) like BlogArticles
    if (topicsGlobal?.topics && Array.isArray(topicsGlobal.topics) && topicsGlobal.topics.length > 0) {
      articlesForDateCheck = articlesForDateCheck.filter((article) =>
        (article?.properties?.tags || []).some((tag) => topicsGlobal.topics.includes(tag)),
      );
    }

    // Apply topic filter (user selection)
    if (filter?.topics && filter.topics.length > 0) {
      articlesForDateCheck = filterBlogArticlesByTopic(articlesForDateCheck, filter.topics);
    }

    // Apply author filter (user selection)
    if (filter?.author && filter.author.length > 0) {
      articlesForDateCheck = filterBlogArticlesByAuthor(articlesForDateCheck, filter.author);
    }

    return [
      {
        value: "updatedLastWeek",
        label: "Posted in the last week",
        disabled: filterBlogArticlesByDate(articlesForDateCheck, "updatedLastWeek").length === 0,
      },
      {
        value: "updatedLastMonth",
        label: "Posted in the last month",
        disabled: filterBlogArticlesByDate(articlesForDateCheck, "updatedLastMonth").length === 0,
      },
      {
        value: "updatedLastYear",
        label: "Posted in the last year",
        disabled: filterBlogArticlesByDate(articlesForDateCheck, "updatedLastYear").length === 0,
      },
      {
        value: "updatedByRange",
        label: "Posted within date range",
        disabled: false,
      },
    ];
  }, [returnedBlogArticles, topicsGlobal, filter?.topics, filter?.author]);

  const topicOptions = useMemo(() => {
    // If topics are configured via web component, ONLY show those topics in the filter
    if (topicsGlobal?.topics && Array.isArray(topicsGlobal.topics) && topicsGlobal.topics.length > 0) {
      return topicsGlobal.topics
        .map((category) => ({ label: category, value: category }));
    }

    // Otherwise, show all available topics from the articles
    return blogCategories
      .map((category) => ({ label: category.charAt(0).toUpperCase() + category.slice(1), value: category }));
  }, [blogCategories, topicsGlobal]);
  // Compute authors filtered by the currently available topics (configuredTopics)
  const authorOptions = useMemo(() => {
    // Start with global topics if configured, otherwise use all available topics
    let topicsToFilter = [];
    
    if (topicsGlobal?.topics && Array.isArray(topicsGlobal.topics) && topicsGlobal.topics.length > 0) {
      topicsToFilter = topicsGlobal.topics;
    } else if (blogCategories && blogCategories.length > 0) {
      topicsToFilter = blogCategories;
    }

    // If user has selected specific topics, narrow down to those topics only
    if (filter?.topics && Array.isArray(filter.topics) && filter.topics.length > 0) {
      topicsToFilter = filter.topics;
    }

    // If there are no topics to filter by, return all authors from the full article list
    if (!topicsToFilter || topicsToFilter.length === 0) {
      const allAuthors = new Set();
      returnedBlogArticles.forEach((article) => {
        const authorList = article?.properties?.author;
        if (authorList && Array.isArray(authorList)) {
          authorList.forEach((a) => allAuthors.add(a.name));
        }
      });
      return Array.from(allAuthors).sort().map((a) => ({ label: a, value: a }));
    }

    // Create a set of lowercase topics for case-insensitive matching
    const allowedTopics = new Set(topicsToFilter.map(t => t.toLowerCase()));
    const authorsWithTopics = new Set();

    // Find authors whose articles have tags in the allowed topics
    returnedBlogArticles.forEach((article) => {
      const articleTags = article?.properties?.tags || [];
      const authorList = article?.properties?.author;
      if (!authorList || !Array.isArray(authorList)) return;
      
      // Check if any of the article's tags match the allowed topics (case-insensitive)
      if (articleTags.some((tag) => allowedTopics.has(tag.trim().toLowerCase()))) {
        authorList.forEach((a) => authorsWithTopics.add(a.name));
      }
    });

    // Return sorted authors
    return Array.from(authorsWithTopics).sort().map((a) => ({ label: a, value: a }));
  }, [returnedBlogArticles, topicsGlobal, blogCategories, filter?.topics]);

  return (
    <div
      id="search_filter"
      className={`wmcads-search-filter ${
        showFilterOverrideMobile
          ? "wmcads-search-filter--is-open wmcads-search-filter--has-inputs-checked"
          : null
      }`}
    >
      <div className="wmcads-search-filter__header">
        <h3 className="wmcads-search-filter__header-title">Filter</h3>

        <button
          type="button"
          className="wmcads-search-filter__clear-all wmcads-hide-desktop"
          onClick={() => setClearFilters(true)}
        >
          Clear all
        </button>
        <button
          type="button"
          id="hide_filter_btn"
          className="wmcads-search-filter__close"
          onClick={() => setClearFilters(true)}
          aria-label="Close filter"
        >
          <svg aria-hidden="true" focusable="false">
            <title>Close</title>
            <use
              xlinkHref="#wmcads-general-cross"
              href="#wmcads-general-cross"
            ></use>
          </svg>
        </button>
      </div>
      <FilterAccordion
        title="Topic"
        options={topicOptions}
        forceOpen={filter.topics && filter.topics.length > 0}
        optionSelected={useCallback((optionValue) => {
          setFilter((prev) => {
            const topics = prev.topics || [];
            if (topics.includes(optionValue)) {
              return { ...prev, topics: topics.filter((category) => category !== optionValue) };
            }
            return { ...prev, topics: [...topics, optionValue] };
          });
        }, [setFilter])}
        optionSelectedFn={useCallback((value) =>
          filter.topics.includes(value) ? true : undefined
        , [filter.topics])}
      />
      <FilterAccordion
        title="Author"
        options={authorOptions}
        forceOpen={filter.author && filter.author.length > 0}
        optionSelected={useCallback((optionValue) => {
          setFilter((prev) => {
            const authors = prev.author || [];
            if (authors.includes(optionValue)) {
              return { ...prev, author: authors.filter((a) => a !== optionValue) };
            }
            return { ...prev, author: [...authors, optionValue] };
          });
        }, [setFilter])}
        optionSelectedFn={useCallback((value) =>
          filter.author.includes(value) ? true : undefined
        , [filter.author])}
      />
      {/* pass the whole filter object into the filter accordion */}
      <FilterAccordion
        title="Date"
        options={dates}
        selectOne
        filter={filter}
        clearFilters={clearFilters}
        forceOpen={filter.dates != null}
        optionSelected={useCallback((optionValue) => {
          setFilter((prev) => ({ ...prev, dates: optionValue }));
        }, [setFilter])}
        optionSelectedFn={useCallback((value) =>
          filter.dates === value ? true : undefined
        , [filter.dates])}
        setDateRanges={setDateRanges}
      />
      <div className="wmcads-search-filter__mobile-filter-update wmcads-hide-desktop">
        <button
          id="show_results_btn"
          className="wmcads-btn wmcads-btn--block"
          onClick={() => setShowFilterOverrideMobile(false)}
        >{`Show ${noOfResults} results`}</button>
      </div>
      {filter.topics.length != 0 ||
      filter.author.length != 0 ||
      filter.dates != null ? (
        <button
          type="button"
          className="wmcads-search-filter__clear-all wmcads-hide-mobile wmcads-col-1 bg-white wmcads-text-align-left"
          onClick={() => setClearFilters(true)}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            style={{
              display: "inline-block",
              fill: "#c05701",
              stroke: "#c05701",
              strokeWidth: "25px",
            }}
          >
            <title>Close</title>
            <use
              xlinkHref="#wmcads-general-cross"
              href="#wmcads-general-cross"
            ></use>
          </svg>
          Clear all filters
        </button>
      ) : null}
    </div>
  );
};

export default React.memo(BlogFilter);

BlogFilter.propTypes = {
  returnedBlogArticles: PropTypes.arrayOf(PropTypes.object),
  filter: PropTypes.object,
  clearFilters: PropTypes.bool,
  setFilter: PropTypes.func,
  showFilterOverrideMobile: PropTypes.bool,
  noOfResults: PropTypes.number,
  setShowFilterOverrideMobile: PropTypes.func,
  blogCategories: PropTypes.arrayOf(PropTypes.string),
  authors: PropTypes.arrayOf(PropTypes.string),
  setDateRanges: PropTypes.func,
  setClearFilters: PropTypes.func,
  topicsGlobal: PropTypes.object,
};

// Defaults provided in the function signature to avoid using defaultProps on a function component