import PropTypes from "prop-types";

import FilterAccordion from "./FilterAccordion";

import { getSearchParam } from "../helpers/urlSearchParams";

import filterBlogArticlesByDate from "../helpers/filterBlogArticlesByDate";


if (getSearchParam('author')) {
  console.log('url has authors');
}

const BlogFilter = ({
  returnedBlogArticles,
  filter,
  setFilter,
  noOfResults,
  showFilterOverrideMobile,
  setShowFilterOverrideMobile,
  blogCategories,
  authors,
  setDateRanges
}) => {

  const dates = [
    { value: "updatedLastWeek", label: "Posted in the last week", disabled: !!filterBlogArticlesByDate(returnedBlogArticles, 'updatedLastWeek').length },
    { value: "updatedLastMonth", label: "Posted in the last month", disabled: !!filterBlogArticlesByDate(returnedBlogArticles, 'updatedLastMonth').length },
    { value: "updatedLastYear", label: "Posted in the last year", disabled: !!filterBlogArticlesByDate(returnedBlogArticles, 'updatedLastYear').length },
    { value: "updatedByRange", label: "Posted within date range", disabled: !false },
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
          onClick={() =>
            setFilter({ sort: "", topics: [], author: [], dates: undefined })
          }
        >
          Clear all
        </a>
        <a
          href="#"
          id="hide_filter_btn"
          className="wmcads-search-filter__close"
          onClick={() =>
            setFilter({ sort: "", topics: [], author: [], dates: undefined })
          }
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
      <FilterAccordion
        title="Topic"
        options={blogCategories.map((category) => ({
          label: category,
          value: category,
        }))}
        optionSelected={(optionValue) => {
          const topics = filter.topics;
          if (topics.includes(optionValue)) {
            setFilter({
              ...filter,
              topics: topics.filter(
                (category) => category !== optionValue
              ),
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
        optionSelected={(optionValue) => {
          const authors = filter.author;
          if (authors.includes(optionValue)) {
            setFilter({
              ...filter,
              author: authors.filter(
                (author) => author !== optionValue
              ),
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
      <FilterAccordion
        title="Date"
        options={dates}
        selectOne
        selectedDate={filter.dates}
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
      {filter.topics.length != 0 || filter.author.length != 0 || filter.dates != undefined ? (
      <a href="#"
        className="wmcads-search-filter__clear-all wmcads-hide-mobile"
        onClick={() =>
          setFilter({ sort: "", topics: [], author: [], dates: null, dateRangeSet: undefined })
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
  );
};

export default BlogFilter;

BlogFilter.propTypes = {
  returnedBlogArticles: PropTypes.arrayOf(PropTypes.object),
  filter: PropTypes.object,
  setFilter: PropTypes.func,
  showFilterOverrideMobile: PropTypes.bool,
  noOfResults: PropTypes.number,
  setShowFilterOverrideMobile: PropTypes.func,
  blogCategories: PropTypes.arrayOf(PropTypes.string),
  authors: PropTypes.arrayOf(PropTypes.string),
  setDateRanges: PropTypes.func
};

BlogFilter.defaultProps = {
  returnedBlogArticles: [],
  filter: { sort: "", topics: [], author: [], dates: undefined },
  noOfResults: 0,
  setShowFilterOverrideMobile: () => {},
  setFilter: () => {},
  blogCategories: [],
  authors: [],
  setDateRanges: () => { },
};
