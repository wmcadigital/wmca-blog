import PropTypes from "prop-types";

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
  const dates = [
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
  ];

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
        options={blogCategories.map((category) => ({
          label: category,
          value: category,
        }))}
        forceOpen={filter.topics && filter.topics.length > 0}
        optionSelected={(optionValue) => {
          const topics = filter.topics;
          if (topics.includes(optionValue)) {
            setFilter({
              ...filter,
              topics: topics.filter((category) => category !== optionValue),
            });
          } else {
            setFilter({
              ...filter,
              topics: [...filter.topics, optionValue],
            });
          }
        }}
        optionSelectedFn={(value) =>
          filter.topics.includes(value) ? true : undefined
        }
      />
      <FilterAccordion
        title="Author"
        options={authors.map((author) => ({
          label: author,
          value: author,
        }))}
        forceOpen={filter.author && filter.author.length > 0}
        optionSelected={(optionValue) => {
          const authors = filter.author;
          if (authors.includes(optionValue)) {
            setFilter({
              ...filter,
              author: authors.filter((author) => author !== optionValue),
            });
          } else {
            setFilter({
              ...filter,
              author: [...filter.author, optionValue],
            });
          }
        }}
        optionSelectedFn={(value) =>
          filter.author.includes(value) ? true : undefined
        }
      />
      {/* pass the whole filter object into the filter accordion */}
      <FilterAccordion
        title="Date"
        options={dates}
        selectOne
        filter={filter}
        clearFilters={clearFilters}
        forceOpen={filter.dates != null}
        optionSelected={(optionValue) => {
          setFilter({ ...filter, dates: optionValue });
        }}
        optionSelectedFn={(value) =>
          filter.dates === value ? true : undefined
        }
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
          className="wmcads-search-filter__clear-all wmcads-hide-mobile"
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