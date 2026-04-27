import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Head from 'next/head';
import { generateBreadcrumbSchema, generateOrganizationSchema } from "../helpers/seoHelpers";
import { getStoredPreferences, savePreferences, clearPreferences, extractPreferences } from "../helpers/filterPreferences";

// Helper to chunk array into smaller arrays
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

import getBlogArticles from "../api/getBlogArticles";
/* eslint-disable react-hooks/exhaustive-deps */
import { send as analyticsSend } from "../analytics";

import Banner from "./Banner";
// import Link from "./Link";
import BlogArticleLink from "./BlogArticleLink";
import Search from "./Search";

// Dynamic imports for non-critical UI components (loaded after main content)
const Pagination = dynamic(() => import("./Pagination"), {
  loading: () => <div style={{ height: '40px' }} />, // Placeholder to prevent layout shift
  ssr: true,
});

const SortControl = dynamic(() => import("./SortControl"), {
  loading: () => <div style={{ height: '40px' }} />,
  ssr: true,
});

const BlogFilter = dynamic(() => import("./BlogFilter"), {
  loading: () => <div style={{ height: '100px' }} />,
  ssr: true,
});

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

// Note: do not read `window` at module initialization. Use component state
// and a client-only effect to populate values so server and initial client
// renders remain identical.

const BlogArticles = () => {
  const router = useRouter();
  const [topicsGlobal, setTopicsGlobal] = useState({});
  const [bannerGlobal, setBannerGlobal] = useState({});
  const [testError, setTestError] = useState(false);
  const [showProductionError, setShowProductionError] = useState(false);

  // Throw error during render if testError is true
  if (testError) {
    throw new Error('🧪 Test error boundary - This is a deliberate test error to verify error handling works correctly.');
  }

  // Debug: Log banner data to help identify if it's being received from web component
  useEffect(() => {
  }, [bannerGlobal]);

  const hasWindow = typeof window !== "undefined";
  const win = hasWindow ? window : undefined;
  const [returnedBlogArticles, setReturnedBlogArticles] = useState([]);
  const [blogArticles, setBlogArticles] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  // Initialize to 0 to match server render; update from URL in useEffect only
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.setTopics) setTopicsGlobal(window.setTopics);
    
    // Try to get banner from multiple sources in priority order:
    // 1. window.setBanner (web component direct injection)
    // 2. window.setTopics.banner (web component postMessage injection)
    // 3. localStorage (standalone mode saved banner configuration)
    if (window.setBanner) {
      setBannerGlobal(window.setBanner);
    } else if (window.setTopics?.banner) {
      setBannerGlobal(window.setTopics.banner);
    } else {
      // Standalone mode fallback: try localStorage
      try {
        const storedBanner = window.localStorage?.getItem('wmca-blog-banner');
        if (storedBanner) {
          const parsedBanner = JSON.parse(storedBanner);
          setBannerGlobal(parsedBanner);
        }
      } catch (e) {
        // ignore parse errors
      }
    }
    
    // Sync page from URL (only on client to avoid hydration mismatch)
    try {
      const qp = new URLSearchParams(window.location.search).get("page");
      const asNumber = qp !== null ? parseInt(qp, 10) : 1;
      if (!Number.isNaN(asNumber)) {
        const newPage = Math.max(0, asNumber - 1);
        setPage(newPage);
      }
    } catch (e) {
      // ignore
    }
    
    // If the host provided a page number via the web component, apply it.
    try {
      const injectedPage = window.setTopics?.page;
      const qp = new URLSearchParams(window.location.search).get("page");
      // Only apply injected page if URL doesn't explicitly set page
      if (injectedPage && !qp) {
        const p = Number(injectedPage);
        if (!Number.isNaN(p)) {
          applyingHostPageRef.current = true;
          setPage(Math.max(0, p - 1));
          hostProvidedPageRef.current = true;
          setTimeout(() => { applyingHostPageRef.current = false; }, 0);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Listen for postMessage-injected topics from the host and apply page updates
  useEffect(() => {
    if (!hasWindow) return;
    const handler = (ev) => {
      try {
        const payload = ev?.detail || null;
        if (!payload) return;
        // Web component properties take priority - only apply postMessage values if not already set by web component
        if (payload.topics && !window.setTopics?.topics) setTopicsGlobal(Object.assign({}, window.setTopics || {}, { topics: payload.topics }));
        if (payload.banner && !window.setBanner) setBannerGlobal(payload.banner);
        if (payload.name && !window.setTopics?.name) setTopicsGlobal((prev) => ({ ...(prev || {}), name: payload.name }));
        if (payload.page && window.setTopics?.page === undefined) {
          const p = Number(payload.page);
          if (!Number.isNaN(p)) {
            applyingHostPageRef.current = true;
            setPage(Math.max(0, p - 1));
            hostProvidedPageRef.current = true;
            setTimeout(() => { applyingHostPageRef.current = false; }, 0);
          }
        }
      } catch (e) {
        // ignore malformed events
      }
    };
    window.addEventListener('wmca:setTopics', handler);
    return () => window.removeEventListener('wmca:setTopics', handler);
  }, []);

  // Restore filter preferences from localStorage and search params from URL after hydration
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Restore filter preferences from localStorage
    const stored = getStoredPreferences();
    if (Object.keys(stored).length > 0) {
      setFilter({
        sort: stored.sort || "descending",
        topics: stored.topics || [],
        author: stored.author || [],
        dates: stored.dates || null,
        dateRangeSet: undefined, // Date range set comes from URL or filter UI, not localStorage
      });
    }
    
    // Restore search params from URL
    try {
      const qp = new URLSearchParams(window.location.search);
      setSearchParamsState(qp);
    } catch (e) {
      // ignore
    }
  }, []);

  // Sync page state with URL query parameter whenever router is ready
  useEffect(() => {
    if (!router.isReady) return;
    
    const pageParam = router.query.page;
    if (pageParam) {
      const parsed = parseInt(pageParam, 10);
      if (!Number.isNaN(parsed)) {
        setPage(Math.max(0, parsed - 1));
      }
    }
  }, [router.query.page, router.isReady]);

  // Listen for Next.js router route changes to handle back navigation from article
  useEffect(() => {
    if (!hasWindow || !router.isReady) return;

    const resetFiltersFromURL = () => {
      // Re-apply all filters from the current URL
      const qp = new URLSearchParams(window.location.search);
      const dates = qp.get("dates");
      const sort = qp.get("sort");
      const author = qp.get("author");
      const topics = qp.get("topics");
      const dateRangeSet = qp.get("dateRangeSet");
      const pageParam = qp.get("page");

      // Reset filters to match URL
      setFilter((prev) => {
        const updated = { ...prev };
        updated.sort = sort || "descending";
        updated.topics = topics ? topics.split("/") : [];
        updated.author = author ? author.split("/") : [];
        updated.dates = dates || null;
        if (dateRangeSet) {
          try {
            updated.dateRangeSet = JSON.parse(dateRangeSet);
          } catch (e) {
            updated.dateRangeSet = undefined;
          }
        } else {
          updated.dateRangeSet = undefined;
        }
        return updated;
      });

      // Reset page to match URL
      if (pageParam !== null) {
        const parsed = parseInt(pageParam, 10);
        if (!Number.isNaN(parsed)) setPage(Math.max(0, parsed - 1));
      } else {
        setPage(0);
      }

      // Force scroll to top
      if (window.scrollTo) {
        window.scrollTo(0, 0);
      }
    };

    const handleRouteChange = (url) => {
      if (url === '/' || url === '/demo-topics') {
        setTimeout(resetFiltersFromURL, 50);
      }
    };

    // Listen for article unmount event
    const handleArticleUnmount = () => {
      if ((window.location.pathname === '/' || window.location.pathname === '/demo-topics')) {
        resetFiltersFromURL();
      }
    };

    router.events?.on('routeChangeComplete', handleRouteChange);
    window.addEventListener('article-unmount', handleArticleUnmount);
    
    return () => {
      router.events?.off('routeChangeComplete', handleRouteChange);
      window.removeEventListener('article-unmount', handleArticleUnmount);
    };
  }, [router.events, router.isReady, hasWindow]);

  // Notify host (web component) when the current page changes so the
  // host can keep its `page` property/attribute in sync.
  useEffect(() => {
    if (!hasWindow) return;
    try {
      const currentPage = page + 1; // expose as 1-based
      // If embedded in a host iframe, post to parent
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'wmca:pageChange', page: currentPage }, '*');
      } else {
        // If running top-level and a host element exists, update it directly
        try {
          const host = document.querySelector && document.querySelector('wmca-blog');
          if (host) {
            if (typeof host.setPage === 'function') host.setPage(currentPage);
            else if (host.setAttribute) host.setAttribute('page', String(currentPage));
          }
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // ignore
    }
  }, [page]);

  // previous filter query string; initialize empty and set later to avoid
  // referencing `filterQueryString` before it's defined.
  const prevFilterQueryRef = useRef(null);
  const isFirstCombinedEffectRun = useRef(true);
  const urlRestorePending = useRef(false);
  const hostProvidedPageRef = useRef(false);
  const applyingHostPageRef = useRef(false);
  const searchDebounceTimerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(() => null);
  const [searchButtonClicked, setSearchButtonClicked] = useState("tick");
  const [showFilterOverrideMobile, setShowFilterOverrideMobile] =
    useState(false);
  const [sortDefault, setsortDefault] = useState("descending");

  const [clearFilters, setClearFilters] = useState(false);

  // Initialize with default filter state; sync from localStorage only in useEffect (client-only)
  const [filter, setFilter] = useState({
    sort: "descending",
    topics: [],
    author: [],
    dates: null,
    dateRangeSet: undefined,
  });

  // shim for react-router `useSearchParams`
  // Initialize with empty search params; sync from URL only in useEffect (client-only)
  const [searchParams, setSearchParamsState] = useState(() => {
    return new URLSearchParams('');
  });
  const setSearchParams = (qs) => {
    // `qs` is expected to be a query-string (no leading '?')
    const search = qs ? `?${qs}` : '';
    if (hasWindow) {
      const newUrl = `${win.location.pathname}${search}`;
      // Debug: log page, incoming qs and the URL we will write to history.
      // Temporary instrumentation to help diagnose why `?page=` is not
      // appearing during pagination updates. Remove once verified.
      try {
        // `page` is the internal 0-based page state; expose both for clarity
        // in logs. Use console.log to ensure visibility in browsers that
        // hide debug-level messages.
      } catch (e) {
        // ignore logging failures
      }
      win.history.replaceState(null, '', newUrl);
      // Only update state if the search string actually changed to avoid
      // creating a new URLSearchParams object on every call (which would
      // trigger effects that depend on `searchParams` and can cause
      // infinite update loops).
      try {
        const current = searchParams ? searchParams.toString() : '';
        const incoming = qs || '';
        if (current === incoming) return;
      } catch (e) {
        // fall through and update state if anything unexpected happens
      }
      setSearchParamsState(new URLSearchParams(search));
    }
  };

  // Live region message for screen readers when results change
  const [liveMessage, setLiveMessage] = useState("");
  const [liveKey, setLiveKey] = useState(0);

  // Persist filter preferences to localStorage whenever filter changes
  useEffect(() => {
    if (filter) {
      const preferences = extractPreferences(filter);
      savePreferences(preferences);
    }
  }, [filter.sort, filter.topics, filter.author, filter.dates]);

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
    const pagePart = `page=${pageNumber}`;
    if (base && pagePart) return `${base}&${pagePart}`;
    if (base) return base;
    if (pagePart) return pagePart;
    return "";
  };

  const getBlogData = async () => {
    try {
      setLoading(true);
      const response = await getBlogArticles();
      setLoading(false);

      let returnedBlogArticles = response?.items ?? [];

      let blogTopics = (topicsGlobal?.topics && topicsGlobal.topics.length)
        ? topicsGlobal.topics
        : getBlogArticleTopics(returnedBlogArticles);

      if (typeof blogTopics === "string") {
        blogTopics = JSON.parse(blogTopics);
      }

      setBlogCategories(blogTopics);

      // Note: Do NOT filter articles here based on blogTopics.
      // blogTopics represents the available categories, not the active filter.
      // Filtering should only happen based on filter.topics state.

      setReturnedBlogArticles(returnedBlogArticles);
      setAuthors(getAuthors(returnedBlogArticles));
      const chunked = chunkArray(returnedBlogArticles, 5);
      setBlogArticles(chunked);
    } catch (e) {
      setLoading(false);
    }
  };

  const queryParams = new URLSearchParams(hasWindow ? win.location.search : '');

  const dates = queryParams.get("dates");
  const sort = queryParams.get("sort");
  const author = queryParams.get("author");
  const topics = queryParams.get("topics");
  const dateRangeSet = queryParams.get("dateRangeSet");

  const setDateRanges = useCallback(
    (newRanges) => {
      setFilter((prev) => {
        try {
          if (JSON.stringify(prev.dateRangeSet) === JSON.stringify(newRanges))
            return prev;
        } catch (e) {
          // ignore serialization errors
        }
        return { ...prev, dateRangeSet: newRanges };
      });
    },
    [setFilter],
  );

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
      
      // Clear stored preferences and reset pagination when filters are reset
      clearPreferences();
      setPage(0);

      setClearFilters(false);
    }
  }, [clearFilters]);

  // Initialize debounced search term on mount to ensure articles display immediately
  useEffect(() => {
    setDebouncedSearchTerm(searchTerm);
  }, []);

  // Debounce search term updates (wait 500ms after user stops typing)
  useEffect(() => {
    // Clear previous timer if one exists
    if (searchDebounceTimerRef.current) {
      clearTimeout(searchDebounceTimerRef.current);
    }

    // Set a new timer to update the debounced search term
    searchDebounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    // Cleanup: clear timer on unmount or before setting a new one
    return () => {
      if (searchDebounceTimerRef.current) {
        clearTimeout(searchDebounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  // Notify host (web component) when topics change so the
  // host can keep its URL in sync with the current topics.
  useEffect(() => {
    if (!hasWindow) return;
    try {
      const currentTopics = filter.topics && filter.topics.length > 0 ? filter.topics : [];
      
      // If embedded in a host iframe, post to parent
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'wmca:topicChange', topics: currentTopics }, '*');
      }
    } catch (e) {
      // ignore
    }
  }, [filter.topics, hasWindow]);

  // Read topics from URL query parameter and apply to filter on page load
  // This allows topics to be preserved when returning from an article page
  useEffect(() => {
    if (!hasWindow) return;
    try {
      const topicsParam = new URLSearchParams(win.location.search).get('topics');
      if (topicsParam) {
        // Parse topics from slash-separated string (e.g., "security/transport/housing")
        const parsedTopics = topicsParam.split('/').filter(t => t.trim());
        if (parsedTopics.length > 0) {
          setFilter(prev => ({ ...prev, topics: parsedTopics }));
        }
      } else {
        // No URL topics parameter - ensure filter.topics is empty to show all articles
        setFilter(prev => ({ ...prev, topics: [] }));
      }
    } catch (e) {
      // ignore
    }
  }, [hasWindow]);

  useEffect(() => {
    // (was previously updating search params here) — combined into a single effect below
  }, [filter]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Defer fetching blog data until after first paint to reduce LCP contention
    let mounted = true;
    const rafCleanup = { raf: null, timeout: null };

    if (hasWindow && win.requestAnimationFrame) {
      rafCleanup.raf = win.requestAnimationFrame(() => {
        rafCleanup.timeout = setTimeout(() => {
          if (mounted) {
            getBlogData();
          }
        }, 0);
      });
    } else {
      rafCleanup.timeout = setTimeout(() => {
        if (mounted) {
          getBlogData();
        }
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      mounted = false;
      if (rafCleanup.raf && hasWindow && win.cancelAnimationFrame) {
        win.cancelAnimationFrame(rafCleanup.raf);
      }
      if (rafCleanup.timeout) clearTimeout(rafCleanup.timeout);
    };
  }, []);

    // Ensure the search/list refreshes when navigating back from an article
    useEffect(() => {
      if (!hasWindow) return;

      const handleBackNavigation = () => {
        try {
          // If we're on the list page, refresh data to reflect any state changes
          const path = win.location.pathname || '';
          if (path === '/' || path === '/demo-topics') {
            // Re-fetch data and re-apply filters from URL
            getBlogData();
            // Re-apply all URL parameters to filter state to ensure consistency
            const qp = new URLSearchParams(win.location.search);
            
            const dates = qp.get("dates");
            const sort = qp.get("sort");
            const author = qp.get("author");
            const topics = qp.get("topics");
            const dateRangeSet = qp.get("dateRangeSet");
            const pageParam = qp.get("page");

            // Reset and reapply filters from URL
            setFilter((prev) => {
              const updated = { ...prev };
              if (sort) updated.sort = sort;
              if (topics) updated.topics = topics.split("/");
              if (author) updated.author = author.split("/");
              if (dates) updated.dates = dates;
              if (dateRangeSet) {
                try {
                  updated.dateRangeSet = JSON.parse(dateRangeSet);
                } catch (e) {
                  // ignore parsing errors
                }
              }
              return updated;
            });

            // Reset page from URL if present
            if (pageParam !== null) {
              const parsed = parseInt(pageParam, 10);
              if (!Number.isNaN(parsed)) setPage(Math.max(0, parsed - 1));
            }
          }
        } catch (e) {
          // ignore
        }
      };

      // popstate covers back/forward navigation; pageshow handles bfcache restores
      win.addEventListener('popstate', handleBackNavigation);
      win.addEventListener('pageshow', handleBackNavigation);
      // Also listen for Next.js router events bridged to the window so
      // client-side navigation and back inside the iframe are handled.
      const routeChangeHandler = (ev) => {
        try {
          const url = ev?.detail?.url;
          if (!url) return;
          if (url === '/' || url === '/demo-topics') {
            getBlogData();
            // Re-apply filters from the URL in the event
            const qp = new URLSearchParams(url.includes('?') ? url.split('?')[1] : '');
            
            const dates = qp.get("dates");
            const sort = qp.get("sort");
            const author = qp.get("author");
            const topics = qp.get("topics");
            const dateRangeSet = qp.get("dateRangeSet");
            const pageParam = qp.get("page");

            setFilter((prev) => {
              const updated = { ...prev };
              if (sort) updated.sort = sort;
              if (topics) updated.topics = topics.split("/");
              if (author) updated.author = author.split("/");
              if (dates) updated.dates = dates;
              if (dateRangeSet) {
                try {
                  updated.dateRangeSet = JSON.parse(dateRangeSet);
                } catch (e) {
                  // ignore parsing errors
                }
              }
              return updated;
            });

            if (pageParam !== null) {
              const parsed = parseInt(pageParam, 10);
              if (!Number.isNaN(parsed)) setPage(Math.max(0, parsed - 1));
            }
          }
        } catch (e) {
          /* ignore */
        }
      };
      win.addEventListener('wmca:routeChange', routeChangeHandler);

      return () => {
        win.removeEventListener('popstate', handleBackNavigation);
        win.removeEventListener('pageshow', handleBackNavigation);
        win.removeEventListener('wmca:routeChange', routeChangeHandler);
      };
      // intentionally not including getBlogData in deps to avoid double-fetch on mount
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  // Re-fetch articles when topicsGlobal changes from web component
  useEffect(() => {
    if (!hasWindow) return;
    // Always fetch blog data, regardless of whether topicsGlobal.topics is set
    // topicsGlobal.topics is just a way to configure available categories, not a filter
    getBlogData();
  }, [topicsGlobal?.topics, hasWindow]);

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
          const absoluteTop = (hasWindow ? win.scrollY : 0) + rect.top;
          if (hasWindow) win.scrollTo({ top: absoluteTop, behavior: "smooth" });
        }

        // adjust for fixed header overlap if necessary
        const headerEl = document.querySelector(".wmcads-header");
        const cookieBannerEl = document.querySelector(".wmcads-cookies-banner");
        const headerHeight =
          (headerEl?.offsetHeight || 0) + (cookieBannerEl?.offsetHeight || 0);
        if (headerHeight > 0 && hasWindow && win.requestAnimationFrame) {
          // run another frame then nudge up by headerHeight + small gap
          win.requestAnimationFrame(() => {
            win.scrollBy({
              top: -(headerHeight + 8),
              left: 0,
              behavior: "smooth",
            });
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
          if (hasWindow) win.scrollTo({
            top: fallbackEl.offsetTop || 0,
            behavior: "smooth",
          });
        }

        const hadTabIndex = fallbackEl.hasAttribute("tabindex");
        if (!hadTabIndex) fallbackEl.setAttribute("tabindex", "-1");
        fallbackEl.focus();
        if (!hadTabIndex) fallbackEl.removeAttribute("tabindex");
      } else {
        if (hasWindow) win.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    // Wait for the next paint/layout to ensure the newly rendered results are in the DOM
    // Use double requestAnimationFrame as a robust way to run after layout is settled.
    if (hasWindow && win.requestAnimationFrame) {
      win.requestAnimationFrame(() => {
        win.requestAnimationFrame(() => {
          scrollAndFocusResults();
        });
      });
    } else {
      // fallback short delay
      setTimeout(scrollAndFocusResults, 50);
    }
  }, [page, blogArticles]);

  // Track when page changes come from the host vs user interaction.
  useEffect(() => {
    if (applyingHostPageRef.current) {
      // This change was applied from the host; clear the applying flag.
      applyingHostPageRef.current = false;
      return;
    }
    // If the host had previously provided a page but the page now changed
    // without the applying flag, assume user interaction and clear the host flag.
    if (hostProvidedPageRef.current) {
      hostProvidedPageRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    let filteredBlogArticles = returnedBlogArticles;

    // First, apply topicsGlobal as a default scope (configured topics from web component)
    if (topicsGlobal?.topics && Array.isArray(topicsGlobal.topics) && topicsGlobal.topics.length > 0) {
      filteredBlogArticles = filterBlogArticlesByTopic(
        filteredBlogArticles,
        topicsGlobal.topics,
      );
    }

    if (debouncedSearchTerm) {
      filteredBlogArticles = searchBlogArticles(
        filteredBlogArticles,
        debouncedSearchTerm,
      );
    }

    if (filter.topics.length) {
      filteredBlogArticles = filterBlogArticlesByTopic(
        filteredBlogArticles,
        filter.topics,
      );
    }

    if (filter.author.length) {
      filteredBlogArticles = filterBlogArticlesByAuthor(
        filteredBlogArticles,
        filter.author,
      );
    }

    if (filter.dates) {
      filter.dates !== "updatedByRange"
        ? (filteredBlogArticles = filterBlogArticlesByDate(
            filteredBlogArticles,
            filter.dates,
          ))
        : null;
    }

    if (filter.dateRangeSet && filter.dates === "updatedByRange") {
      filteredBlogArticles = filterBlogArticlesByDate(
        filteredBlogArticles,
        filter.dates,
        filter.dateRangeSet,
      );
    }

    // Sort the filtered articles and update display
    // Apply sort order to the filtered results (which already have topic, author, date filters applied)
    let sortedArticles = filteredBlogArticles;
    
    if (filter.sort === "ascending") {
      setsortDefault("ascending");
      sortedArticles = sortBlogArticles(filteredBlogArticles, true);
    } else if (filter.sort === "descending") {
      setsortDefault("descending");
      sortedArticles = sortBlogArticles(filteredBlogArticles);
    } else if (filter.sort === "name") {
      setsortDefault("name");
      sortedArticles = sortBlogArticles(filteredBlogArticles, "name");
    } else {
      setsortDefault("descending");
    }

    // Update blog articles with sorted and filtered results
    const chunkedResults = chunkArray(sortedArticles, 5);
    setBlogArticles(chunkedResults);

    // Recompute available authors based on the currently filtered set (respecting topics)
    const availableAuthors = getAuthors(returnedBlogArticles, filter.topics);

    // Only prune selected authors after blog data has loaded. During initial
    // mount the returnedBlogArticles may be empty and would incorrectly cause
    // selected authors (restored from the URL) to be removed.
    if (
      returnedBlogArticles &&
      returnedBlogArticles.length &&
      filter.author &&
      filter.author.length
    ) {
      const filteredSelectedAuthors = filter.author.filter((a) =>
        availableAuthors.includes(a),
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
        message =
          "No matching results. Try removing filters or using fewer keywords.";
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
    debouncedSearchTerm,
    sortDefault,
    topicsGlobal,
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
        const qs = buildSearchString(page);
        setSearchParams(qs);
        urlRestorePending.current = false;
      } else {
        // If a filter changed due to user interaction, ensure page is reset to 0
        // unless the host explicitly provided a page to respect.
        if (!hostProvidedPageRef.current) {
          if (page !== 0) setPage(0);
        }
        // Write URL using page 0 (buildSearchString will convert to 1-based)
        const qs0 = buildSearchString(0);
        setSearchParams(qs0);
      }
    } else {
      const qs = buildSearchString(page);
      setSearchParams(qs);
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

  // When a search is performed (either via search button or clear button), 
  // immediately apply the search without waiting for debounce
  useEffect(() => {
    setDebouncedSearchTerm(searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchButtonClicked]);

  // When a search is performed (either via search button or live input),
  // reset pagination to the first page (internal 0-based = 0).
  useEffect(() => {
    if (!hasWindow) return;
    // Reset page when the explicit search button is clicked, unless host provided the page
    if (!hostProvidedPageRef.current) setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchButtonClicked]);

  useEffect(() => {
    if (!hasWindow) return;
    try {
      if (searchTerm !== null && String(searchTerm).trim() !== "") {
        if (!hostProvidedPageRef.current) setPage(0);
      }
    } catch (e) {
      // ignore
    }
  }, [searchTerm]);

  const noOfResults = blogArticles.flat().length;

  // set url params for article breadcrumb
  const urlParams = filterQueryString;
  useEffect(() => {
    if (hasWindow) {
      try {
        if (win.sessionStorage) {
          win.sessionStorage.setItem("urlParams", urlParams);
        }
      } catch (e) {
        // sessionStorage may not be available in sandboxed iframes
        // This is expected when iframe lacks allow-same-origin for security
      }
    }
  }, [urlParams]); // reset params if filters updated

  useEffect(() => {
    analyticsSend({
      hitType: "pageview",
      page: hasWindow ? win.location.pathname : "/",
      title: topicsGlobal.name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicsGlobal.name]);

  return (
    <>
      {showProductionError && (
        <div className="wmcads-container wmcads-m-t-lg wmcads-m-b-lg">
          <main className="wmcads-container--main" role="main" aria-label="Error message">
            <div className="wmcads-col-1">
              <div className="wmcads-msg-summary wmcads-msg-summary--error wmcads-m-b-lg" role="alert" aria-live="assertive">
                <div className="wmcads-msg-summary__header">
                  <svg className="wmcads-msg-summary__icon" aria-hidden="true" focusable="false">
                    <use href="#wmcads-general-warning-triangle"></use>
                  </svg>
                  <h3 className="wmcads-msg-summary__title" id="prod-error-title">Something went wrong</h3>
                </div>
                <div className="wmcads-msg-summary__info" aria-describedby="prod-error-title">
                  <p>We encountered an unexpected error while displaying this content. Our team has been notified. Please try refreshing the page.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShowProductionError(false)}
                  className="wmcads-btn wmcads-btn--primary"
                  aria-label="Try again to reload the content"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="wmcads-btn wmcads-btn--secondary"
                  aria-label="Refresh the entire page"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </main>
        </div>
      )}
      {!showProductionError && (
        <>
      <Head>
        <title>{topicsGlobal.name || 'WMCA blog'}</title>
        
        {/* Preconnect and DNS prefetch for external CDNs to improve font loading */}
        <link rel="preconnect" href="https://cloudcdn.wmca.org.uk" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.wmca.org.uk" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Canonical URL for SEO */}
        <link rel="canonical" href={topicsGlobal.url} />
        
        {/* Enhanced meta tags */}
        <meta name="description" content={topicsGlobal.summary || 'WMCA blog'} suppressHydrationWarning />
        <meta name="keywords" content={topicsGlobal.name || 'WMCA, blog'} suppressHydrationWarning />
        <meta name="author" content="West Midlands Combined Authority" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en-GB" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={topicsGlobal.name || 'WMCA blog'} suppressHydrationWarning />
        <meta property="og:description" content={topicsGlobal.summary || ''} suppressHydrationWarning />
        <meta property="og:url" content={topicsGlobal.url} suppressHydrationWarning />
        <meta property="og:image" content={bannerGlobal.bannerimg} suppressHydrationWarning />
        <meta property="og:image:alt" content={topicsGlobal.name || 'WMCA blog'} suppressHydrationWarning />
        <meta property="og:site_name" content={bannerGlobal.name} suppressHydrationWarning />
        <meta property="og:locale" content="en_GB" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={topicsGlobal.name || 'WMCA blog'} suppressHydrationWarning />
        <meta name="twitter:description" content={topicsGlobal.summary || ''} suppressHydrationWarning />
        <meta name="twitter:image" content={bannerGlobal.bannerimg} suppressHydrationWarning />
        <meta name="twitter:image:alt" content={topicsGlobal.name || 'WMCA blog'} suppressHydrationWarning />

        {/* JSON-LD Structured Data */}
        {generateBreadcrumbSchema(topicsGlobal.breadcrumbs?.breadcrumb || [], topicsGlobal.name) && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ 
              __html: JSON.stringify(generateBreadcrumbSchema(topicsGlobal.breadcrumbs?.breadcrumb || [], topicsGlobal.name)) 
            }}
          />
        )}
        {generateOrganizationSchema() && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ 
              __html: JSON.stringify(generateOrganizationSchema()) 
            }}
          />
        )}
      </Head>
      <div className="template-search" suppressHydrationWarning>
        <Breadcrumb
          current={topicsGlobal.url}
          name={topicsGlobal.name}
          parent={topicsGlobal.breadcrumbs?.breadcrumb?.[0]}
          parent2={topicsGlobal.breadcrumbs?.breadcrumb?.[1]}
          parent3={topicsGlobal.breadcrumbs?.breadcrumb?.[2]}
          parent4={topicsGlobal.breadcrumbs?.breadcrumb?.[3]}
          parent5={topicsGlobal.breadcrumbs?.breadcrumb?.[4]}
          parent6={topicsGlobal.breadcrumbs?.breadcrumb?.[5]}
          parent7={topicsGlobal.breadcrumbs?.breadcrumb?.[6]}
          parent8={topicsGlobal.breadcrumbs?.breadcrumb?.[7]}
        />
        <Banner
          image={bannerGlobal.bannerimg}
          title={bannerGlobal.name}
          summary={bannerGlobal.summary}
          position={bannerGlobal.position}
        />
        <div className="wmcads-container">
          <main
            id="wmcads-main-content"
            className="wmcads-container--main"
            tabIndex={-1}
            role="main"
          >
            <div className="wmcads-col-1 wmcads-col-md-2-3 wmcads-p-r-xl wmcads-m-b-lg">
              <Search
                placeholder="Blog search..."
                changeCallback={setSearchTerm}
                searchButtonClickedCallback={searchButtonClickedFn}
              />
              {process.env.NODE_ENV === 'development' && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setTestError(true)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#c41e3a',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    🧪 Dev Error (w/ details)
                  </button>
                  <button
                    onClick={() => setShowProductionError(true)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#0066cc',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    👁️ Prod Error Preview
                  </button>
                </div>
              )}
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
                        target.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
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
                          <svg
                            className="wmcads-msg-summary__icon"
                            aria-hidden="true"
                            focusable="false"
                          >
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
                            introductionText={
                              blogArticle.properties.introduction
                            }
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
              <aside
                id="search_filter"
                className="wmcads-col-1 wmcads-col-md-1-3 wmcads-m-b-lg"
              >
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
                  topicsGlobal={topicsGlobal}
                  setPage={setPage}
                />
              </aside>
            </div>
          </main>
        </div>
      </div>
        </>
      )}
    </>
  );
};

export default BlogArticles;
