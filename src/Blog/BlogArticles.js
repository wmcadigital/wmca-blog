import { useState, useEffect } from "react";
import chunk from "lodash/chunk";
import flatten from "lodash/flatten";
import { useSearchParams, useLocation } from "react-router-dom";

import getBlogArticles from "../api/getBlogArticles";
/* eslint-disable react-hooks/exhaustive-deps */
import { send as analyticsSend } from "../analytics";

import Banner from "./Banner";
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
import Breadcrumb from "./Breadcrumb";

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
  const [showFilterOverrideMobile, setShowFilterOverrideMobile] =
    useState(false);
  const [sortDefault, setsortDefault] = useState("descending");

  const [clearFilters, setClearFilters] = useState(false);

  const [filter, setFilter] = useState({
    sort: "descending",
    topics: [],
    author: [],
    dates: null,
    dateRangeSet: undefined,
  });

  let [searchParams, setSearchParams] = useSearchParams();

  let filterQueryString = Object.keys(filter)
    .map((key) => {
      if (Array.isArray(filter[key])) {
        return key + "=" + filter[key].join("/");
      } else if (typeof filter[key] === "object") {
        return key + "=" + JSON.stringify(filter[key]);
      } else {
        return key + "=" + filter[key];
      }
    })
    .join("&");

  const getBlogData = async () => {
    setLoading(true);
    const response = await getBlogArticles();
    setLoading(false);

    let returnedBlogArticles = response?.items ?? [];
    let blogTopics =
      window?.setTopics.topics ?? getBlogArticleTopics(returnedBlogArticles);

    if (typeof blogTopics === "string") {
      blogTopics = JSON.parse(blogTopics);
    }

    setBlogCategories(blogTopics);

    returnedBlogArticles = returnedBlogArticles.filter((prop) =>
      prop.properties.tags.some((tags) => blogTopics.includes(tags))
    );

    setReturnedBlogArticles(returnedBlogArticles);
    setAuthors(getAuthors(returnedBlogArticles));
    setBlogArticles(chunk(returnedBlogArticles, 5));
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const dates = queryParams.get("dates");
  const sort = queryParams.get("sort");
  const author = queryParams.get("author");
  const topics = queryParams.get("topics");
  const dateRangeSet = queryParams.get("dateRangeSet");

  const setDateRanges = (newRanges) => {
    setFilter({ ...filter, dateRangeSet: newRanges });
  };

  useEffect(() => {
    if (clearFilters) {
      setFilter((prevState) => ({
        ...prevState,
        sort: "",
        topics: [],
        author: [],
        dates: null,
        dateRangeSet: undefined,
      }));

      setClearFilters(false);
    }
  }, [clearFilters]);

  useEffect(() => {
    setSearchParams(filterQueryString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Defer fetching blog data until after first paint to reduce LCP contention
    let mounted = true;
    const rafCleanup = { raf: null, timeout: null };

    if (window.requestAnimationFrame) {
      rafCleanup.raf = window.requestAnimationFrame(() => {
        rafCleanup.timeout = setTimeout(() => {
          if (mounted) getBlogData();
        }, 0);
      });
    } else {
      rafCleanup.timeout = setTimeout(() => {
        if (mounted) getBlogData();
      }, 0);
    }

    if (dateRangeSet !== "undefined" && dateRangeSet !== null) {
      if (filter.dateRangeSet === undefined) {
        setFilter({ ...filter, dateRangeSet: JSON.parse(dateRangeSet) });
      }
    }

    if (dates) {
      setFilter((prevState) => ({
        ...prevState,
        dates: dates === "null" ? null : dates,
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
        topics: topics.split("/"),
      }));
    }

    if (author) {
      setFilter((prevState) => ({
        ...prevState,
        author: author.split("/"),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      mounted = false;
      if (rafCleanup.raf && window.cancelAnimationFrame) {
        window.cancelAnimationFrame(rafCleanup.raf);
      }
      if (rafCleanup.timeout) clearTimeout(rafCleanup.timeout);
    };
  }, []);

  // When the visible page of results changes, scroll the main results area into view
  // and focus it so keyboard and screen-reader users are taken to the updated results.
  useEffect(() => {
    const scrollAndFocusResults = () => {
      // Prefer scrolling to the visible results count line so users see the
      // "Found X matching results" message when paging.
      const resultsCountEl = document.getElementById("wmcads-results-count");
      const fallbackEl = document.getElementById("wmcads-main-content");

      const targetEl = resultsCountEl || fallbackEl;

      if (resultsCountEl) {
        // Directly scroll the results count element into view at the top of the
        // viewport so users see the "Found X matching results" line (block: 'start').
        // After that, nudge the page up by the header height if present so the
        // count isn't hidden behind a fixed header.
        try {
          resultsCountEl.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (e) {
          // fallback to window scroll
          const rect = resultsCountEl.getBoundingClientRect();
          const absoluteTop = window.scrollY + rect.top;
          window.scrollTo({ top: absoluteTop, behavior: "smooth" });
        }

        // adjust for fixed header overlap if necessary
        const headerEl = document.querySelector(".wmcads-header");
        const cookieBannerEl = document.querySelector(".wmcads-cookies-banner");
        const headerHeight = (headerEl?.offsetHeight || 0) + (cookieBannerEl?.offsetHeight || 0);
        if (headerHeight > 0) {
          // run another frame then nudge up by headerHeight + small gap
          window.requestAnimationFrame(() => {
            window.scrollBy({ top: -(headerHeight + 8), left: 0, behavior: "smooth" });
          });
        }

        // Focus the main container so screen readers announce the updated content.
        const focusEl = fallbackEl || resultsCountEl;
        const hadTabIndex = focusEl.hasAttribute("tabindex");
        if (!hadTabIndex) focusEl.setAttribute("tabindex", "-1");
        focusEl.focus();
        if (!hadTabIndex) focusEl.removeAttribute("tabindex");
      } else if (fallbackEl) {
        try {
          fallbackEl.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (e) {
          window.scrollTo({ top: fallbackEl.offsetTop || 0, behavior: "smooth" });
        }

        const hadTabIndex = fallbackEl.hasAttribute("tabindex");
        if (!hadTabIndex) fallbackEl.setAttribute("tabindex", "-1");
        fallbackEl.focus();
        if (!hadTabIndex) fallbackEl.removeAttribute("tabindex");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    // Wait for the next paint/layout to ensure the newly rendered results are in the DOM
    // Use double requestAnimationFrame as a robust way to run after layout is settled.
    if (typeof window !== "undefined" && window.requestAnimationFrame) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          scrollAndFocusResults();
        });
      });
    } else {
      // fallback short delay
      setTimeout(scrollAndFocusResults, 50);
    }
  }, [page, blogArticles]);

  useEffect(() => {
    let filteredBlogArticles = returnedBlogArticles;

    if (searchTerm) {
      setPage(0);
      filteredBlogArticles = searchBlogArticles(
        returnedBlogArticles,
        searchTerm
      );
    }

    if (filter.topics.length) {
      setPage(0);
      filteredBlogArticles = filterBlogArticlesByTopic(
        filteredBlogArticles,
        filter.topics
      );
    }

    if (filter.author.length) {
      setPage(0);
      filteredBlogArticles = filterBlogArticlesByAuthor(
        filteredBlogArticles,
        filter.author
      );
    }

    if (filter.dates) {
      setPage(0);
      filter.dates !== "updatedByRange"
        ? (filteredBlogArticles = filterBlogArticlesByDate(
            filteredBlogArticles,
            filter.dates
          ))
        : null;
    }

    if (filter.dateRangeSet && filter.dates === "updatedByRange") {
      setPage(0);
      filteredBlogArticles = filterBlogArticlesByDate(
        filteredBlogArticles,
        filter.dates,
        filter.dateRangeSet
      );
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
      setsortDefault("descending");
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
    if (
      filter.topics.length !== 0 ||
      filter.author.length !== 0 ||
      filter.dates !== null ||
      clearFilters
    ) {
      // setBlogArticles(chunk(sortBlogArticles(filteredBlogArticles, true), 5));
      setSearchParams(filterQueryString);
    } else {
      setBlogArticles(chunk(filteredBlogArticles, 5));
    }

    // Recompute available authors based on the currently filtered set (respecting topics)
    const availableAuthors = getAuthors(returnedBlogArticles, filter.topics);

    // Only prune selected authors after blog data has loaded. During initial
    // mount the returnedBlogArticles may be empty and would incorrectly cause
    // selected authors (restored from the URL) to be removed.
    if (returnedBlogArticles && returnedBlogArticles.length && filter.author && filter.author.length) {
      const filteredSelectedAuthors = filter.author.filter((a) =>
        availableAuthors.includes(a)
      );

      if (filteredSelectedAuthors.length !== filter.author.length) {
        setFilter((prev) => ({ ...prev, author: filteredSelectedAuthors }));
      }
    }

    // Update authors shown in the UI
    setAuthors(availableAuthors);
  }, [
    clearFilters,
    filter,
    filterQueryString,
    returnedBlogArticles,
    searchButtonClicked,
    searchParams,
    searchTerm,
    setSearchParams,
    sortDefault,
  ]);

  // Show a small loading spinner when filters change to communicate work in progress
  useEffect(() => {
    // If no filters are selected, don't show loading
    const hasFilters =
      (filter.topics && filter.topics.length > 0) ||
      (filter.author && filter.author.length > 0) ||
      (filter.dates && filter.dates !== null);

    if (!hasFilters) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400); // keep spinner visible for at least 400ms
    return () => clearTimeout(t);
  }, [filter]);

  const authorParam = () => {
    // filter.author = "Bob qwerty";
  };

  if (getSearchParam("author")) {
    // console.log("url has authors");
    authorParam();
  }

  const searchButtonClickedFn = () => {
    searchButtonClicked === "tick"
      ? setSearchButtonClicked("tock")
      : setSearchButtonClicked("tick");
  };

  const noOfResults = flatten(blogArticles).length;

  // set url params for article breadcrumb
  const urlParams = filterQueryString;
  useEffect(() => {
    sessionStorage.setItem("urlParams", urlParams);
  }, [urlParams]); // reset params if filters updated

  useEffect(() => {
    analyticsSend({
      hitType: "pageview",
      page: window.location.pathname,
      title: window?.setTopics?.name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="template-search">
      <Breadcrumb
        current={window?.setTopics?.url}
        name={window?.setTopics?.name}
        parent={window?.setTopics?.breadcrumbs?.breadcrumb[0]}
        parent2={window?.setTopics?.breadcrumbs?.breadcrumb[1]}
        parent3={window?.setTopics?.breadcrumbs?.breadcrumb[2]}
        parent4={window?.setTopics?.breadcrumbs?.breadcrumb[3]}
        parent5={window?.setTopics?.breadcrumbs?.breadcrumb[4]}
        parent6={window?.setTopics?.breadcrumbs?.breadcrumb[5]}
        parent7={window?.setTopics?.breadcrumbs?.breadcrumb[6]}
        parent8={window?.setTopics?.breadcrumbs?.breadcrumb[7]}
      />
      <Banner
        image={window?.setBanner?.bannerimg}
        title={window?.setBanner?.name}
        summary={window?.setBanner?.summary}
        position={window?.setBanner?.position}
      />
      <div className="wmcads-container">
      <main id="wmcads-main-content" className="wmcads-container--main" tabIndex={-1} role="main">
          <div className="wmcads-col-1 wmcads-col-md-2-3 wmcads-p-r-xl wmcads-m-b-lg">
            <Search
              placeholder="Blog search..."
              changeCallback={setSearchTerm}
              searchButtonClickedCallback={searchButtonClickedFn}
            />
          </div>
          <div className="wmcads-grid">
            <div className="main wmcads-col-1 wmcads-col-md-2-3 wmcads-m-b-xl wmcads-p-r-lg">
              {/* Live region for screen readers to announce results updates */}
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: "1px",
                  height: "1px",
                  overflow: "hidden",
                }}
              >
                {loading
                  ? "Searching blog articles."
                  : noOfResults === 0
                  ? "No matching results. Try removing filters or using fewer keywords."
                  : `Found ${noOfResults} matching results.`}
              </div>

              {loading ? (
                <div className="wmcads-loader wmcads-loader--small wmcads-m-l-xs"></div>
              ) : (
                <>
                  <p id="wmcads-results-count">
                    Found <b>{noOfResults}</b> matching results
                  </p>

                  {noOfResults === 0 && (
                    <div className="wmcads-msg-summary wmcads-msg-summary--warning ">
                      <div className="wmcads-msg-summary__header">
                        <svg className="wmcads-msg-summary__icon" aria-hidden="true" focusable="false">
                          <use
                            xlinkHref="#wmcads-general-warning-circle"
                            href="#wmcads-general-warning-circle"
                          ></use>
                        </svg>
                        <h3 className="wmcads-msg-summary__title">
                          There are no matching results
                        </h3>
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
                          route={blogArticle.route.path}
                          key={blogArticle.id || `${page}-${index}`}
                          filter={filter}
                          setFilter={setFilter}
                          name={blogArticle.name}
                          id={blogArticle.id}
                          authors={blogArticle.properties.author}
                          tags={blogArticle.properties.tags}
                          image={
                            Array.isArray(blogArticle.properties.image) &&
                            blogArticle.properties.image.length > 0 &&
                            blogArticle.properties.image[0].url
                              ? blogArticle.properties.image[0].url
                              : "No Image"
                          }
                          imageAlt={
                            Array.isArray(blogArticle.properties.image) &&
                            blogArticle.properties.image.length > 0 &&
                            blogArticle.properties.image[0].url
                              ? blogArticle.properties.image[0].url
                              : "No Image"
                          }
                          imageID={
                            Array.isArray(blogArticle.properties.image) &&
                            blogArticle.properties.image.length > 0 &&
                            blogArticle.properties.image[0].id
                              ? blogArticle.properties.image[0].id
                              : null
                          }
                          publishDate={blogArticle.properties.date}
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
                </>
              )}
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
                clearFilters={clearFilters}
                returnedBlogArticles={returnedBlogArticles}
                filter={filter}
                setClearFilters={setClearFilters}
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
        </main>
      </div>
    </div>
  );
};

export default BlogArticles;
