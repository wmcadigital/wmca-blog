import PropTypes from "prop-types";

import FilterAccordion from "./FilterAccordion";

import { getSearchParam } from "../helpers/urlSearchParams";

import filterBlogArticlesByDate from "../helpers/filterBlogArticlesByDate";

if (getSearchParam("author")) {
  // console.log('url has authors');
}

const BlogFilter = ({
  returnedBlogArticles,
  filter,
  clearFilters,
  setFilter,
  setClearFilters,
  noOfResults,
  showFilterOverrideMobile,
  setShowFilterOverrideMobile,
  blogCategories,
  authors,
  setDateRanges,
}) => {
  // Normalize filter to support legacy tests that use `categories` key
  const normalizedFilter = {
    sort: "",
    topics: [],
    author: [],
    dates: null,
    ...filter,
  };

  // if tests pass categories, map them to topics
  if (normalizedFilter.categories && !normalizedFilter.topics?.length) {
    normalizedFilter.topics = normalizedFilter.categories;
  }

  const dates = [
    {
      value: "updatedLastWeek",
      label: "Posted in the last week",
      disabled: !!filterBlogArticlesByDate(
        returnedBlogArticles,
        "updatedLastWeek"
      ).length,
    },
    {
      value: "updatedLastMonth",
      label: "Posted in the last month",
      disabled: !!filterBlogArticlesByDate(
        returnedBlogArticles,
        "updatedLastMonth"
      ).length,
    },
    {
      value: "updatedLastYear",
      label: "Posted in the last year",
      disabled: !!filterBlogArticlesByDate(
        returnedBlogArticles,
        "updatedLastYear"
      ).length,
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

        <a
          href="#"
          className="wmcads-search-filter__clear-all wmcads-hide-desktop"
          onClick={() => setClearFilters(true)}
        >
          Clear all
        </a>
        <a
          href="#"
          id="hide_filter_btn"
          className="wmcads-search-filter__close"
          onClick={() => setClearFilters(true)}
        >
          <svg>
            <title>Close</title>
            <use
              xlinkHref="#wmcads-general-cross"
              href="#wmcads-general-cross"
            ></use>
          </svg>
        </a>
      </div>
      <div className="wmcads-content-card">
      <FilterAccordion
        title="Topic"
        options={blogCategories.map((category) => ({
          label: category,
          value: category,
        }))}
        optionSelected={(optionValue) => {
          const topics = normalizedFilter.topics || [];
          let updated;
          if (topics.includes(optionValue)) {
            updated = topics.filter((category) => category !== optionValue);
          } else {
            updated = [...topics, optionValue];
          }
          // keep both keys in sync for tests and app
          setFilter({
            ...filter,
            topics: updated,
            categories: updated,
          });
        }}
        optionSelectedFn={(value) =>
          (normalizedFilter.topics || []).includes(value) ? true : undefined
        }
      />
      <FilterAccordion
        title="Author"
        options={authors.map((author) => ({
          label: author,
          value: author,
        }))}
        optionSelected={(optionValue) => {
          const currentAuthors = normalizedFilter.author || [];
          let updated;
          if (currentAuthors.includes(optionValue)) {
            updated = currentAuthors.filter((a) => a !== optionValue);
          } else {
            updated = [...currentAuthors, optionValue];
          }
          setFilter({ ...filter, author: updated });
        }}
        optionSelectedFn={(value) =>
          (normalizedFilter.author || []).includes(value) ? true : undefined
        }
      />
      {/* pass the whole filter object into the filter accordion */}
      <FilterAccordion
        title="Date"
        options={dates}
        selectOne
        filter={filter}
        clearFilters={clearFilters}
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
  {normalizedFilter.topics.length !== 0 ||
  normalizedFilter.author.length !== 0 ||
  normalizedFilter.dates != null ? (
        <a
          href="#"
          className="wmcads-search-filter__clear-all wmcads-hide-mobile"
          onClick={() =>
            setFilter({ ...filter, categories: [], dates: undefined })
          }
        >
          <svg
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
        </a>
      ) : null}
      </div>
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

BlogFilter.defaultProps = {
  returnedBlogArticles: [],
  filter: { sort: "", topics: [], author: [], dates: null },
  noOfResults: 0,
  setShowFilterOverrideMobile: () => {},
  setFilter: () => {},
  blogCategories: [],
  authors: [],
  setDateRanges: () => {},
  setClearFilters: () => {},
};
