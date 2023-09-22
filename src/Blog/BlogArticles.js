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
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState(null);
  const [searchButtonClicked, setSearchButtonClicked] = useState("tick");
  const [showFilterOverrideMobile, setShowFilterOverrideMobile] = useState(false);
  const [sortOrder, setSortOrder] = useState(null);
  const [sortDefault, setsortDefault] = useState("");

  const [filter, setFilter] = useState({
    sort: "",
    topics: [],
    author: [],
    dates: null,
  });

  let [searchParams, setSearchParams] = useSearchParams();

  let filterQueryString = Object.keys(filter).map(key => {
    if (Array.isArray(filter[key])) {
      return key + '=' + filter[key].join('/');
    } else {
      return key + '=' + filter[key];
    }
  }).join('&');


  const getBlogData = async () => {
    setLoading(true);
    const response = await getBlogArticles();
    setLoading(false);
    const returnedBlogArticles = response?.items ?? [];
    // console.log(returnedBlogArticles);
    setReturnedBlogArticles(returnedBlogArticles);
    setBlogCategories(getBlogArticleTopics(returnedBlogArticles));
    setAuthors(getAuthors(returnedBlogArticles));
    setBlogArticles(chunk(returnedBlogArticles, 5));
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const dates = queryParams.get('dates');
  const sort = queryParams.get('sort');
  const author = queryParams.get('author');
  const topics = queryParams.get('topics');
  
  useEffect(() => {
    getBlogData();

    if (dates) {
      setFilter((prevState) => ({
        ...prevState,
        dates: dates,
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

  }, []);

  useEffect(() => {
    let filteredBlogArticles = returnedBlogArticles;
    if (searchTerm) {
      filteredBlogArticles = searchBlogArticles(
        returnedBlogArticles,
        searchTerm
      );
    }

    if (filter.topics.length) {

      filteredBlogArticles = filterBlogArticlesByTopic(
        filteredBlogArticles,
        filter.topics
      );
    }

    if (filter.author.length) {
      filteredBlogArticles = filterBlogArticlesByAuthor(
        filteredBlogArticles,
        filter.author
      );
    }

    if (filter.dates) {
      filteredBlogArticles = filterBlogArticlesByDate(
        filteredBlogArticles,
        filter.dates
      );
    }
    
    // sort values
    const currentParams = Object.fromEntries([...searchParams]);

    if(currentParams.sort == "ascending"){
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
    }  else if (filter.sort === "name") {
      setBlogArticles(chunk(sortBlogArticles(filteredBlogArticles, "name"), 5));
      setSearchParams(filterQueryString);
    } else {
      setBlogArticles(chunk(filteredBlogArticles, 5));
    }

    // topic values
    if (filter.topics.length !== 0 || filter.author.length !== 0 || filter.dates !== null) {

      console.log(filterQueryString, 'DATE!!!!');

      // setBlogArticles(chunk(sortBlogArticles(filteredBlogArticles, true), 5));
      setSearchParams(filterQueryString);
    } else {
      setBlogArticles(chunk(filteredBlogArticles, 5));
    }

  }, [filter, filterQueryString, returnedBlogArticles, searchButtonClicked, searchParams, searchTerm, setSearchParams, sortDefault, sortOrder]);



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

  // console.log(blogArticles);

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
                  // sortChangedCallback={(sortOrder) => setSortOrder(sortOrder)}
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
                filter={filter}
                setFilter={setFilter}
                showFilterOverrideMobile={showFilterOverrideMobile}
                setShowFilterOverrideMobile={setShowFilterOverrideMobile}
                noOfResults={noOfResults}
                blogCategories={blogCategories}
                authors={authors}
              />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogArticles;
