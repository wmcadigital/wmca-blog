import { useState, useEffect } from "react";
import { chunk, flatten } from "lodash";
import { useSearchParams, useLocation } from 'react-router-dom';

import getBlogArticles from "../api/getBlogArticles";

// import Banner from "./Banner";
// import Link from "./Link";
import BlogArticleLink from "./BlogArticleLink";
import Search from "./Search";
import Pagination from "./Pagination";
import SortControl from "./SortControl";
import BlogFilter from "./BlogFilter";
import searchBlogArticles from "../helpers/searchBlogArticles";
import sortBlogArticles from "../helpers/sortBlogArticles";
import getBlogArticleTopics from "../helpers/getBlogArticleTopics";
import getAuthors from "../helpers/getAuthors";
import filterBlogArticlesByTopic from "../helpers/filterBlogArticlesByTopic";
import filterBlogArticlesByAuthor from "../helpers/filterBlogArticlesByAuthor";
import filterBlogArticlesByDate from "../helpers/filterBlogArticlesByDate";
import DelayedComponent from "../helpers/delayedComponent";

// Import Helper functions
import { getSearchParam } from "../helpers/urlSearchParams"; // (used to sync state with URL)

const BlogArticles = () => {
  const [returnedBlogArticles, setReturnedBlogArticles] = useState([]);
  const [blogArticles, setBlogArticles] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [windowTopics, setWindowTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState(null);
  const [searchButtonClicked, setSearchButtonClicked] = useState("tick");
  const [showFilterOverrideMobile, setShowFilterOverrideMobile] = useState(false);
  const [sortDefault, setsortDefault] = useState("");

  const [filter, setFilter] = useState({
    sort: "",
    topics: [],
    author: [],
    dates: null,
    dateRangeSet: undefined,
    resets: false
  });

  let [searchParams, setSearchParams] = useSearchParams();

  let filterQueryString = Object.keys(filter).map(key => {
    if (Array.isArray(filter[key])) {
      return key + '=' + filter[key].join('/');
    } else if (typeof filter[key] === "object") {
      return key + '=' + JSON.stringify(filter[key])
    } else {
      return key + '=' + filter[key];
    }
  }).join('&');


  const getBlogData = async () => {
    setLoading(true);
    const response = await getBlogArticles();
    setLoading(false);
    let returnedBlogArticles = response?.items ?? [];


    console.log(returnedBlogArticles, 'here')

    returnedBlogArticles.map(val => {
      console.log(val.properties.date, 'data')
    })

    console.log(returnedBlogArticles, 'here')
    
    let blogTopics = window?.setTopics ?? getBlogArticleTopics(returnedBlogArticles)

    if (typeof blogTopics === 'string') {
      blogTopics = JSON.parse(blogTopics)
    }

    setBlogCategories(blogTopics) 

    returnedBlogArticles = returnedBlogArticles.filter(props => props.properties.tags.some(tags => blogTopics.includes(tags)));

    setReturnedBlogArticles(returnedBlogArticles);
    setAuthors(getAuthors(returnedBlogArticles));
    setBlogArticles(chunk(returnedBlogArticles, 5));
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const dates = queryParams.get('dates');
  const sort = queryParams.get('sort');
  const author = queryParams.get('author');
  const topics = queryParams.get('topics');
  const dateRangeSet = queryParams.get('dateRangeSet');

  const setDateRanges = (newRanges) => {
    setFilter({ ...filter, dateRangeSet: newRanges });
  };

  useEffect(() => {
    getBlogData();

    if (dateRangeSet !== 'undefined' && dateRangeSet !== null) {
      if (filter.dateRangeSet === undefined) {
        setFilter({ ...filter, dateRangeSet: JSON.parse(dateRangeSet) });
      }
    }

    if (dates) {
      setFilter((prevState) => ({
        ...prevState,
        dates: dates === 'null' ? null : dates,
      }));
    }

    if (sort) {
      setFilter((prevState) => ({
        ...prevState,
        sort: sort,
      }));
    }

    if (topics) {
      setFilter((prevState) => ({
        ...prevState,
        topics: topics.split('/'),
      }));
    }

    if (author) {
      setFilter((prevState) => ({
        ...prevState,
        author: author.split('/'),
      }));
    }

  }, [author, dates, sort, topics, dateRangeSet]);

  useEffect(() => {
    let filteredBlogArticles = returnedBlogArticles;

    if (searchTerm) {
      setPage(0)
      filteredBlogArticles = searchBlogArticles(
        returnedBlogArticles,
        searchTerm
      );
    }

    if (filter.topics.length) {
      setPage(0)
      filteredBlogArticles = filterBlogArticlesByTopic(
        filteredBlogArticles,
        filter.topics
      );
    }

    if (filter.author.length) {
      setPage(0)
      filteredBlogArticles = filterBlogArticlesByAuthor(
        filteredBlogArticles,
        filter.author
      );
    }

    if (filter.dates) {
      setPage(0)
      filter.dates !== 'updatedByRange' ? filteredBlogArticles = filterBlogArticlesByDate(
        filteredBlogArticles,
        filter.dates
      ) : null
    }

    if (filter.dateRangeSet && filter.dates === 'updatedByRange') {
      setPage(0)
      filteredBlogArticles = filterBlogArticlesByDate(
        filteredBlogArticles,
        filter.dates,
        filter.dateRangeSet
      )
    }

    // sort values
    const currentParams = Object.fromEntries([...searchParams]);

    if (currentParams.sort == "ascending") {
      setsortDefault("ascending");
      setBlogArticles(chunk(sortBlogArticles(filteredBlogArticles, true), 5));
    } else if (currentParams.sort == "descending") {
      setsortDefault("descending");
      setBlogArticles(chunk(sortBlogArticles(filteredBlogArticles), 5));
    } else if (currentParams.sort == "name") {
      setsortDefault("name");
      setBlogArticles(chunk(sortBlogArticles(filteredBlogArticles, "name"), 5));
    } else {
      setsortDefault("");
    }

    if (filter.sort === "ascending") {
      setBlogArticles(chunk(sortBlogArticles(filteredBlogArticles, true), 5));
      setSearchParams(filterQueryString);
      // setFilter({ sort: "ascending" });
    } else if (filter.sort === "descending") {
      setBlogArticles(chunk(sortBlogArticles(filteredBlogArticles), 5));
      setSearchParams(filterQueryString);
    } else if (filter.sort === "name") {
      setBlogArticles(chunk(sortBlogArticles(filteredBlogArticles, "name"), 5));
      setSearchParams(filterQueryString);
    } else {
      setBlogArticles(chunk(filteredBlogArticles, 5));
    }

    // topic values
    if (filter.topics.length !== 0 || filter.author.length !== 0 || filter.dates !== null) {
      // setBlogArticles(chunk(sortBlogArticles(filteredBlogArticles, true), 5));
      setSearchParams(filterQueryString);
    } else {
      setBlogArticles(chunk(filteredBlogArticles, 5));
    }

  }, [filter, filterQueryString, returnedBlogArticles, searchButtonClicked, searchParams, searchTerm, setSearchParams, sortDefault]);
 

  const authorParam = () => {
    console.log('url has authors test');
    // filter.author = "Bob qwerty";
  };

  if (getSearchParam('author')) {
    console.log('url has authors');
    authorParam();
  }

  const searchButtonClickedFn = () => {
    searchButtonClicked === "tick"
      ? setSearchButtonClicked("tock")
      : setSearchButtonClicked("tick");
  };

  const noOfResults = flatten(blogArticles).length;

  return (
    <div className="wmcads-container">
      <main className="wmcads-container--main">
        <div className="template-search">
          <div className="wmcads-col-1 wmcads-col-md-2-3 wmcads-p-r-xl wmcads-m-t-lg wmcads-m-b-lg">
            <h1>Blog</h1>
            <Search
              placeholder="Blog search..."
              changeCallback={setSearchTerm}
              searchButtonClickedCallback={searchButtonClickedFn}
            />
          </div>
          <div className="wmcads-grid">
            <div className="main wmcads-col-1 wmcads-col-md-2-3 wmcads-m-b-xl wmcads-p-r-lg">
              {loading ? (
                <div className="wmcads-loader wmcads-loader--small wmcads-m-l-xs"></div>
              ) : (
                <p>
                  Found <b>{noOfResults}</b> matching results
                </p>

              )}

              {noOfResults === 0 && !loading && (
                <div className="wmcads-msg-summary wmcads-msg-summary--warning ">
                  <div className="wmcads-msg-summary__header">
                    <svg className="wmcads-msg-summary__icon">
                      <use xlinkHref="#wmcads-general-warning-circle" href="#wmcads-general-warning-circle"></use>
                    </svg>
                    <h3 className="wmcads-msg-summary__title">There are no matching results</h3>
                  </div>
                  <div className="wmcads-msg-summary__info">
                    <p>Improve your search results by:</p>
                    <ul className="wmcads-unordered-list">
                      <li>Removing filters</li>
                      <li>Double-checking your spelling</li>
                      <li>Using fewer keywords</li>
                      <li>Searching for something less specific</li>
                    </ul>
                  </div>
                </div>
              )}

              {blogArticles.length ? (
                <>
                  {blogArticles[page]?.map((blogArticle, index) => (
                    <BlogArticleLink
                      key={index}
                      filter={filter}
                      setFilter={setFilter}
                      name={blogArticle.name}
                      id={blogArticle.id}
                      authors={blogArticle.properties.author}
                      tags={blogArticle.properties.tags}
                      image={
                        blogArticle.properties.image != null
                          ? blogArticle.properties.image[0].url
                          : "No Image"
                      }
                      publishDate={blogArticle.createDate}
                      introductionText={blogArticle.properties.introduction}
                    />
                  ))}
                  <div className="wmcads-m-t-lg">
                    <Pagination
                      numberOfPages={blogArticles.length}
                      activePage={page}
                      callBack={setPage}
                    />
                  </div>
                </>
              ) : null}
            </div>
            <aside className="wmcads-col-1 wmcads-col-md-1-3 wmcads-m-b-lg">
              <hr className="wmcads-hide-desktop" />
              <DelayedComponent>
                <SortControl
                  filter={filter}
                  setFilter={setFilter}
                  defaultVal={sortDefault}
                />
              </DelayedComponent>
              <div className="wmcads-hide-desktop">
                <button
                  className="wmcads-btn wmcads-btn--primary wmcads-btn--block"
                  id="show_filter_btn"
                  aria-controls="search_filter"
                  aria-expanded="false"
                  onClick={() => setShowFilterOverrideMobile(true)}
                >
                  Filter your results
                </button>
              </div>
              <BlogFilter
                returnedBlogArticles={returnedBlogArticles}
                filter={filter}
                setFilter={setFilter}
                showFilterOverrideMobile={showFilterOverrideMobile}
                setShowFilterOverrideMobile={setShowFilterOverrideMobile}
                noOfResults={noOfResults}
                blogCategories={blogCategories}
                authors={authors}
                setDateRanges={setDateRanges}
              />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogArticles;