import { useState, useEffect } from "react";
import { chunk, flatten } from "lodash";
import { useSearchParams } from 'react-router-dom';

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

  // const params = Object.fromEntries([...searchParams]);
  // console.log('Mounted:', params);

  console.log(filter);

  let filterQueryString = Object.keys(filter).map(key => key + '=' + filter[key]).join('&');

  console.log(filterQueryString);

  // console.log(sortOrder);

  const queryStringToObject = url =>
  [...new URLSearchParams(url.split('?')[1])].reduce(
    (a, [k, v]) => ((a[k] = v), a),
    {}
  );


  const getBlogData = async () => {
    setLoading(true);
    const response = await getBlogArticles();
    setLoading(false);
    const returnedBlogArticles = response?.items ?? [];
    console.log(returnedBlogArticles);
    setReturnedBlogArticles(returnedBlogArticles);
    setBlogCategories(getBlogArticleTopics(returnedBlogArticles));
    setAuthors(getAuthors(returnedBlogArticles));
    setBlogArticles(chunk(returnedBlogArticles, 5));
  };

  useEffect(() => {
    getBlogData();
  }, []);

  useEffect(() => {
    let filteredBlogArticles = returnedBlogArticles;
    if (searchTerm) {
      filteredBlogArticles = searchBlogArticles(
        returnedBlogArticles,
        searchTerm
      );
      console.log(filteredBlogArticles);
    }

    if (filter.topics.length) {
      filteredBlogArticles = filterBlogArticlesByTopic(
        filteredBlogArticles,
        filter.topics
      );
    }

    if (filter.author.length) {
      let filteredBlogArticlesbyAuthor = filteredBlogArticles.map((
        { name }) => ({ name }));
        console.log(filteredBlogArticlesbyAuthor);

      filteredBlogArticles = filterBlogArticlesByAuthor(
        filteredBlogArticles,
        filter.author
      );
      // setSearchParam('author', filter.author);
    }

    if (filter.dates) {
      filteredBlogArticles = filterBlogArticlesByDate(
        filteredBlogArticles,
        filter.dates
      );
    }
    
    // sort values
    const currentParams = Object.fromEntries([...searchParams]);
    // console.log('useEffect:', currentParams);

    // if(currentParams.author != null){
    //   console.log(currentParams.author);
    //   console.log(filter);
    //   console.log(filterQueryString);
    console.log(queryStringToObject('?' + currentParams));
    //   // setFilter(filterQueryString);
    // }

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

    // if (sortOrder === "ascending") {
    //   setBlogArticles(chunk(sortBlogArticles(filteredBlogArticles, true), 5));
    //   setSearchParams(filterQueryString);
    //   // setFilter({ sort: "ascending" });
    // } else if (sortOrder === "descending") {
    //   setBlogArticles(chunk(sortBlogArticles(filteredBlogArticles), 5));
    //   setSearchParams(filterQueryString);
    // }  else if (sortOrder === "name") {
    //   setBlogArticles(chunk(sortBlogArticles(filteredBlogArticles, "name"), 5));
    //   setSearchParams(filterQueryString);
    // } else {
    //   setBlogArticles(chunk(filteredBlogArticles, 5));
    // }

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
    if (filter.topics.length != 0) {
      // setBlogArticles(chunk(sortBlogArticles(filteredBlogArticles, true), 5));
      setSearchParams(filterQueryString);
    } else {
      setBlogArticles(chunk(filteredBlogArticles, 5));
    }

    // if(currentParams.topics.length != 0){
    //   // setsortDefault("ascending");
    //   filteredBlogArticles = filterBlogArticlesByTopic(
    //     filteredBlogArticles,
    //     filter.topics
    //   );
    // }

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

  console.log(blogArticles);

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
                  {blogArticles[page].map((blogArticle, index) => (
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
