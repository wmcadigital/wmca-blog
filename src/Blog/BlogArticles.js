import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  const [page, setPage] = useState(() => {
    try {
      // URL page param is 1-based (user-facing). Internal state is 0-based.
      const qp = new URLSearchParams(window.location.search).get("page");
      const asNumber = qp !== null ? parseInt(qp, 10) : 1;
      if (Number.isNaN(asNumber)) return 0;
      return Math.max(0, asNumber - 1);
    } catch (e) {
      return 0;
    }
  });
  // previous filter query string; initialize empty and set later to avoid
  // referencing `filterQueryString` before it's defined.
  const prevFilterQueryRef = useRef(null);
  const isFirstCombinedEffectRun = useRef(true);
  const urlRestorePending = useRef(false);
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

  // Live region message for screen readers when results change
  const [liveMessage, setLiveMessage] = useState("");
  const [liveKey, setLiveKey] = useState(0);

  const filterQueryString = useMemo(() => {
    return Object.keys(filter)
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
  }, [filter]);

  // Helper to build the search param string including current page (if > 0)
  const buildSearchString = (pageVal = page) => {
    const base = filterQueryString || "";
    // convert internal 0-based page to 1-based page for the URL
    const pageNumber = typeof pageVal === "number" ? pageVal + 1 : page + 1;
    const pagePart = pageNumber > 1 ? `page=${pageNumber}` : "";
    if (base && pagePart) return `${base}&${pagePart}`;
    if (base) return base;
    if (pagePart) return pagePart;
    return "";
  };

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

  const setDateRanges = useCallback((newRanges) => {
    setFilter((prev) => {
      try {
        if (JSON.stringify(prev.dateRangeSet) === JSON.stringify(newRanges)) return prev;
      } catch (e) {
        // ignore serialization errors
      }
      return { ...prev, dateRangeSet: newRanges };
    });
  }, [setFilter]);

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
    // (was previously updating search params here) — combined into a single effect below
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
    // initialize page from query param if present (URL is 1-based)
    const qpPage = queryParams.get("page");
    if (qpPage !== null) {
      const parsed = parseInt(qpPage, 10);
      if (!Number.isNaN(parsed)) setPage(Math.max(0, parsed - 1));
    }
      // If any filters or page were present in the URL, mark that we're restoring
      // state from the URL so we don't treat this programmatic restore as
      // a user-initiated filter change.
      if (topics || author || dates || sort || dateRangeSet || qpPage !== null) {
        urlRestorePending.current = true;
      }

      // Debug trace: log restoration values (remove this in production)
      /* eslint-disable no-console */
      console.debug("BlogArticles mount restore", {
        topics,
        author,
        dates,
        sort,
        dateRangeSet,
        qpPage,
        initialPage: page,
        urlRestorePending: urlRestorePending.current,
      });
      /* eslint-enable no-console */
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
      filter.dates !== "updatedByRange"
        ? (filteredBlogArticles = filterBlogArticlesByDate(
            filteredBlogArticles,
            filter.dates
          ))
        : null;
    }

    if (filter.dateRangeSet && filter.dates === "updatedByRange") {
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
      // search params are updated by the combined effect below
      // setFilter({ sort: "ascending" });
    } else if (filter.sort === "descending") {
      setBlogArticles(chunk(sortBlogArticles(filteredBlogArticles), 5));
    } else if (filter.sort === "name") {
      setBlogArticles(chunk(sortBlogArticles(filteredBlogArticles, "name"), 5));
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
      // search params are updated by the combined effect below
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

    // Update screen reader live region message. Use the filtered list length
    // so SR users hear an announcement whenever the results change.
    try {
      const resultsCount = Array.isArray(filteredBlogArticles)
        ? filteredBlogArticles.length
        : 0;
      let message = "";
      if (loading) {
        message = "Searching blog articles.";
      } else if (resultsCount === 0) {
        message = "No matching results. Try removing filters or using fewer keywords.";
      } else {
        message = `Found ${resultsCount} matching results.`;
      }
      setLiveMessage(message);
      setLiveKey(Date.now());
    } catch (e) {
      // ignore
    }
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

  // Keep a ref of previous filter query string so we can detect filter changes.

  // Update search params whenever filter or page change (centralised to avoid races)
  // If the filter changed, reset the visible page to 0 and write page=1 (omitted) to the URL.
  useEffect(() => {
    const prev = prevFilterQueryRef.current;
    const filterChanged = prev !== filterQueryString;

    // Ignore the very first run of this combined effect — this allows
    // initial restoration of `filter` and `page` from the URL without
    // treating it as a user-initiated filter change that resets the page.
    if (isFirstCombinedEffectRun.current) {
      // First run after mount — don't write the search params so any
      // existing URL (including page) is preserved. Just record the
      // current filterQueryString and continue.
      prevFilterQueryRef.current = filterQueryString;
      isFirstCombinedEffectRun.current = false;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      return;
    }

    if (filterChanged) {
      // If the filter change was just restoring state from the URL on mount,
      // don't treat it as a user change — just preserve the current page and
      // clear the pending flag.
      if (urlRestorePending.current) {
        setSearchParams(buildSearchString(page));
        urlRestorePending.current = false;
      } else {
        // If a filter changed due to user interaction, ensure page is reset to 0.
        if (page !== 0) setPage(0);
        // Write URL using page 0 (buildSearchString will convert to 1-based)
        setSearchParams(buildSearchString(0));
      }
    } else {
      setSearchParams(buildSearchString(page));
    }

    prevFilterQueryRef.current = filterQueryString;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterQueryString, page]);

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
      <a
        href="#search_filter"
        onClick={(e) => {
          // Prevent default hash navigation; programmatically reveal and focus the filter
          e.preventDefault();
          try {
            // Ensure the mobile filter overlay is visible
            setShowFilterOverrideMobile(true);

            // Wait a tick for any UI changes (overlay open) to render, then focus
            window.setTimeout(() => {
              const target = document.getElementById("search_filter");
              if (target) {
                // make focusable, focus, then remove tabindex
                const prevTab = target.getAttribute("tabindex");
                target.setAttribute("tabindex", "-1");
                target.focus({ preventScroll: false });
                if (prevTab === null) target.removeAttribute("tabindex");
                // also ensure element is visible in viewport
                try {
                  target.scrollIntoView({ behavior: "smooth", block: "start" });
                } catch (err) {
                  /* ignore */
                }
              }
            }, 50);
          } catch (err) {
            // fallback: jump to hash
            window.location.hash = "#search_filter";
          }
        }}
        onFocus={(e) => {
          const el = e.currentTarget;
          el.style.position = "static";
          el.style.left = "0";
          el.style.width = "auto";
          el.style.height = "auto";
          el.style.padding = "8px";
          el.style.background = "#fff";
          el.style.zIndex = "1000";
        }}
        onBlur={(e) => {
          const el = e.currentTarget;
          el.style.position = "absolute";
          el.style.left = "-9999px";
          el.style.width = "1px";
          el.style.height = "1px";
          el.style.padding = "0";
          el.style.background = "transparent";
        }}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
        }}
      >
        Skip to filters
      </a>
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
                {loading ? (
                  "Searching blog articles."
                ) : (
                  <span key={liveKey}>{liveMessage}</span>
                )}
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
                          resultIndex={page * 5 + index + 1}
                          totalResults={noOfResults}
                        />
                      ))}
                      <div className="wmcads-m-t-lg">
                        <Pagination
                          numberOfPages={blogArticles.length}
                          activePage={page}
                          // setPage only; URL is updated by the combined effect
                          callBack={(p) => {
                            setPage(p);
                          }}
                        />
                      </div>
                    </>
                  ) : null}
                </>
              )}
            </div>
            <aside id="search_filter" className="wmcads-col-1 wmcads-col-md-1-3 wmcads-m-b-lg">
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
