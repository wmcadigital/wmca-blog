import PropTypes from "prop-types";
import { useCallback, useMemo } from "react";

import FilterAccordion from "./FilterAccordion";

import { getSearchParam } from "../helpers/urlSearchParams";

import filterBlogArticlesByDate from "../helpers/filterBlogArticlesByDate";

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
  authors = [],
  setDateRanges = () => {},
}) => {
  const dates = useMemo(() => [
    {
      value: "updatedLastWeek",
      label: "Posted in the last week",
      // disable when there are no matching articles for this date range
      disabled:
        filterBlogArticlesByDate(returnedBlogArticles, "updatedLastWeek")
          .length === 0,
    },
    {
      value: "updatedLastMonth",
      label: "Posted in the last month",
      disabled:
        filterBlogArticlesByDate(returnedBlogArticles, "updatedLastMonth")
          .length === 0,
    },
    {
      value: "updatedLastYear",
      label: "Posted in the last year",
      disabled:
        filterBlogArticlesByDate(returnedBlogArticles, "updatedLastYear")
          .length === 0,
    },
    {
      value: "updatedByRange",
      label: "Posted within date range",
      // allow user to pick any custom range (enabled by default)
      disabled: false,
    },
  ], [returnedBlogArticles]);

  const topicOptions = useMemo(() => blogCategories.map((category) => ({ label: category, value: category })), [blogCategories]);
  const authorOptions = useMemo(() => authors.map((a) => ({ label: a, value: a })), [authors]);

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

export default BlogFilter;

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
};

// Defaults provided in the function signature to avoid using defaultProps on a function component