// This component prefers hash-based URL search params (HashRouter) as the
// source of truth. When a `page` param exists only in the outer query
// string (location.search) we move it into the hash search params and
// remove it from the outer query so there's a single `page=` location.
//
// Clearing filters (via `clearFilters`) will also remove the corresponding
// URL params for known filter keys so the URL reflects the cleared state.
import { useState, useEffect } from "react";
import { chunk, flatten } from "lodash";
import { useSearchParams, useLocation } from "react-router-dom";

import getBlogArticles from "../api/getBlogArticles";
import ReactGA from "react-ga4";

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

  // Build a query string from the filter but only include keys that have
  // meaningful values. This prevents empty arrays or undefined fields from
  // overwriting existing URL params (for example removing `author` on refresh).
  let filterQueryString = Object.keys(filter)
    .map((key) => {
      const val = filter[key];
      if (Array.isArray(val)) {
        if (val.length === 0) return null;
        return key + "=" + val.join("/");
      }
      if (val === undefined || val === null) return null;
      if (typeof val === "object") {
        // skip empty objects
        try {
          const s = JSON.stringify(val);
          if (s === "{}") return null;
          return key + "=" + s;
        } catch (e) {
          return null;
        }
      }
      if (typeof val === "string" && val === "") return null;
      return key + "=" + val;
    })
    .filter(Boolean)
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
  // Robust param getter: check react-router `searchParams` first, then
  // parse the location.hash (if present), then fall back to the outer
  // query string. This covers different URL shapes on refresh and direct
  // links (e.g. ?page=3#/?author=Foo or /#/?author=Foo).
  const getParam = (key) => {
    const sp = searchParams.get(key);
    if (sp) return sp;
    // parse hash query string after '?'
    try {
      const rawHash = location.hash || "";
      const idx = rawHash.indexOf("?");
      const hashQuery = idx >= 0 ? rawHash.slice(idx + 1) : "";
      if (hashQuery) {
        const hashParams = new URLSearchParams(hashQuery);
        const hv = hashParams.get(key);
        if (hv) return hv;
      }
    } catch (e) {
      // ignore parse errors
    }
    return queryParams.get(key);
  };

  const dates = getParam("dates");
  const sort = getParam("sort");
  const author = getParam("author");
  const topics = getParam("topics");
  const dateRangeSet = getParam("dateRangeSet");

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
    try {
      const current = new URLSearchParams(searchParams.toString());
      const incoming = new URLSearchParams(filterQueryString);

      // Helper: apply incoming params, and remove known filter keys that
      // are no longer present in incoming. This makes clearing filters
      // result in their corresponding URL params being removed.
      const applyIncomingParams = (curParams, incParams) => {
        // known filter keys we manage in the URL
        const knownKeys = ["sort", "topics", "author", "dates", "dateRangeSet", "page"];

        // set incoming entries
        for (const [k, v] of incParams) curParams.set(k, v);

        // remove known keys that are absent in incoming
        for (const k of knownKeys) {
          if (!incParams.has(k)) curParams.delete(k);
        }

        return curParams;
      };

      applyIncomingParams(current, incoming);
      setSearchParams(current);
    } catch (err) {
      // fallback to simple set
      setSearchParams(filterQueryString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

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
        topics: topics
          .split("/")
          .map((s) => decodeURIComponent(s.replace(/\+/g, " ")).trim()),
      }));
    }

    if (author) {
      // Decode plus signs and percent-encoding so the author values match
      // the labels produced by getAuthors (e.g. "Charles+Rapson" => "Charles Rapson").
      setFilter((prevState) => ({
        ...prevState,
        author: author
          .split("/")
          .map((a) => decodeURIComponent(a.replace(/\+/g, " ")).trim()),
      }));
    }

    // Read page from either the hash params (preferred) or the query string.
    // Example URLs the app may see:
    //  - /?page=3#/?sort=...&page=3  (page duplicated)
    // We prefer the hash params (react-router hash routing) and if page is
    // only present in the query string, move it into the hash and remove it
    // from the query string so there's only one source of truth.
  const pageFromHash = getParam("page");

    // Also inspect the outer query string directly so we can detect when
    // a page exists only there and move it into the hash/searchParams.
    const pageFromQuery = queryParams.get("page");

    if (pageFromHash) {
      const parsed = parseInt(pageFromHash, 10);
      if (!Number.isNaN(parsed) && parsed > 0) {
        setPage(Math.max(0, parsed - 1));
      }
    } else if (pageFromQuery) {
      // If only the query string has page, move it into the hash-based
      // search params used by react-router and remove it from location.search
      const parsed = parseInt(pageFromQuery, 10);
      if (!Number.isNaN(parsed) && parsed > 0) {
        setPage(Math.max(0, parsed - 1));
        try {
          // put page into the hash search params via setSearchParams
          const current = new URLSearchParams(searchParams.toString());
          current.set("page", String(parsed));
          setSearchParams(current);

          // remove page from the leading query string while preserving other keys
          const newOuter = new URLSearchParams(location.search);
          newOuter.delete("page");
          const newOuterStr = newOuter.toString();
          const newUrl =
            window.location.pathname +
            (newOuterStr ? `?${newOuterStr}` : "") +
            window.location.hash;
          window.history.replaceState(null, "", newUrl);
        } catch (err) {
          // fallback: do nothing if we can't move it
        }
      }
    }
    return () => {
      mounted = false;
      if (rafCleanup.raf && window.cancelAnimationFrame) {
        window.cancelAnimationFrame(rafCleanup.raf);
      }
      if (rafCleanup.timeout) clearTimeout(rafCleanup.timeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the `page` query param in sync when page state changes
  useEffect(() => {
    try {
      const p = new URLSearchParams(searchParams.toString());
      if (page > 0) p.set("page", String(page + 1));
      else p.delete("page");
      setSearchParams(p);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("BlogArticles: failed to sync page query param", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // When the page changes, scroll the main results area to the top and focus it for accessibility
  useEffect(() => {
    try {
      const el = document.getElementById("wmcads-main-content");
      if (el) {
        // scroll to top of the main content where results live
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // move focus to main for screen readers; prevent additional scrolling if supported
        if (typeof el.focus === "function") {
          try {
            el.focus({ preventScroll: true });
          } catch (e) {
            el.focus();
          }
        }
      } else {
        // fallback to window scroll
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("BlogArticles: failed to scroll to top on page change", err);
    }
  }, [page]);

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

    // compute filter+page string locally to avoid stale closure / lint issues
    const fqsp = (() => {
      if (!filterQueryString) return page > 0 ? `page=${page + 1}` : "";
      return page > 0 ? `${filterQueryString}&page=${page + 1}` : filterQueryString;
    })();

    if (filter.sort === "ascending") {
      setBlogArticles(chunk(sortBlogArticles(filteredBlogArticles, true), 5));
      try {
        const current = new URLSearchParams(searchParams.toString());
        const incoming = new URLSearchParams(fqsp);

        // reuse same merging behaviour as above: set incoming and remove missing known keys
        const knownKeys = ["sort", "topics", "author", "dates", "dateRangeSet", "page"];
        for (const [k, v] of incoming) current.set(k, v);
        for (const k of knownKeys) if (!incoming.has(k)) current.delete(k);
        setSearchParams(current);
      } catch (err) {
        setSearchParams(fqsp);
      }
      // setFilter({ sort: "ascending" });
    } else if (filter.sort === "descending") {
      setBlogArticles(chunk(sortBlogArticles(filteredBlogArticles), 5));
      try {
        const current = new URLSearchParams(searchParams.toString());
        const incoming = new URLSearchParams(fqsp);
        const knownKeys = ["sort", "topics", "author", "dates", "dateRangeSet", "page"];
        for (const [k, v] of incoming) current.set(k, v);
        for (const k of knownKeys) if (!incoming.has(k)) current.delete(k);
        setSearchParams(current);
      } catch (err) {
        setSearchParams(fqsp);
      }
    } else if (filter.sort === "name") {
      setBlogArticles(chunk(sortBlogArticles(filteredBlogArticles, "name"), 5));
      try {
        const current = new URLSearchParams(searchParams.toString());
        const incoming = new URLSearchParams(fqsp);
        const knownKeys = ["sort", "topics", "author", "dates", "dateRangeSet", "page"];
        for (const [k, v] of incoming) current.set(k, v);
        for (const k of knownKeys) if (!incoming.has(k)) current.delete(k);
        setSearchParams(current);
      } catch (err) {
        setSearchParams(fqsp);
      }
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
      try {
        const current = new URLSearchParams(searchParams.toString());
        const incoming = new URLSearchParams(fqsp);
        const knownKeys = ["sort", "topics", "author", "dates", "dateRangeSet", "page"];
        for (const [k, v] of incoming) current.set(k, v);
        for (const k of knownKeys) if (!incoming.has(k)) current.delete(k);
        setSearchParams(current);
      } catch (err) {
        setSearchParams(fqsp);
      }
    } else {
      setBlogArticles(chunk(filteredBlogArticles, 5));
    }

    // Recompute available authors based on the currently filtered set (respecting topics)
    const availableAuthors = getAuthors(returnedBlogArticles, filter.topics);

    // If any selected author is no longer available for the selected topics,
    // remove them from filter — but only after we have loaded articles. This
    // prevents clearing the selected authors which were set from the URL on
    // initial mount before returnedBlogArticles has populated.
    if (
      returnedBlogArticles &&
      returnedBlogArticles.length > 0 &&
      filter.author &&
      filter.author.length
    ) {
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
    page,
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
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
      title: window?.setTopics?.name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("filter updated", filter);
  }, [filter]);

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
      <main
          id="wmcads-main-content"
          className="wmcads-container--main"
          tabIndex={-1}
          role="main"
          // remove default focus outline/box-shadow when this element receives focus
          style={{ outline: "none", boxShadow: "none" }}
          onFocus={(e) => {
            e.currentTarget.style.outline = "none";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
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
                  <p>
                    Found <b>{noOfResults}</b> matching results
                  </p>

                  {noOfResults === 0 && (
                    <div className="wmcads-msg-summary wmcads-msg-summary--warning ">
                      <div className="wmcads-msg-summary__header">
                        <svg className="wmcads-msg-summary__icon">
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
