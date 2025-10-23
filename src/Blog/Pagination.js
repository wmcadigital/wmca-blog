import PropTypes from "prop-types";
import React from "react";

const Pagination = ({ numberOfPages, activePage, callBack }) => {
  const paginationArray = new Array(numberOfPages).fill(null);

  // Determine active page from URL query param `page` (1-based) if present,
  // otherwise fall back to the `activePage` prop (0-based) or 0.
  let activePageIndex = 0;
  try {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get("page");
    if (pageParam) {
      const parsed = parseInt(pageParam, 10);
      if (!Number.isNaN(parsed) && parsed > 0) {
        // convert to 0-based index
        activePageIndex = parsed - 1;
      } else if (typeof activePage === "number") {
        activePageIndex = activePage;
      }
    } else if (typeof activePage === "number") {
      activePageIndex = activePage;
    }
    } catch (e) {
      // If URL parsing fails for any reason, fall back to prop
      // Log to aid debugging without throwing
      // eslint-disable-next-line no-console
      console.warn("Pagination: failed to parse URL page param", e);
      if (typeof activePage === "number") {
        activePageIndex = activePage;
      }
    }

  // ensure activePageIndex is within bounds
  if (typeof numberOfPages === "number" && numberOfPages > 0) {
    activePageIndex = Math.min(numberOfPages - 1, Math.max(0, activePageIndex));
  }

  return (
    <div className="wmcads-pagination">
      <ol className="wmcads-pagination__nav">
        {paginationArray.map((_, index) => {
          return (
            <li
              key={index}
              className={`wmcads-pagination__item ${
                index === activePageIndex ? "wmcads-pagination__item--active" : null
              } ${
                index === activePageIndex - 1
                  ? "wmcads-pagination__item--previous"
                  : null
              }`}
            >
              {index === activePageIndex ? (
                index + 1
              ) : (
                (() => {
                  // Build href preserving other query params but setting page
                  const params = new URLSearchParams(window.location.search);
                  params.set("page", String(index + 1));
                  const href = `${window.location.pathname}?${params.toString()}`;

                  const onClick = (e) => {
                    e.preventDefault();
                    // update URL without reloading
                    try {
                      const newUrl = `${window.location.pathname}?${params.toString()}`;
                      window.history.pushState({}, "", newUrl);
                    } catch (err) {
                      // eslint-disable-next-line no-console
                      console.warn("Pagination: history.pushState failed", err);
                    }
                    if (typeof callBack === "function") callBack(index);
                  };

                  return (
                    <a
                      className="wmcads-link"
                      href={href}
                      onClick={onClick}
                      aria-label={`Go to page ${index + 1}`}
                    >
                      {index + 1}
                    </a>
                  );
                })()
              )}
            </li>
          );
        })}
      </ol>
      {activePageIndex !== 0 ? (
        (() => {
          const prevIndex = activePageIndex - 1;
          const p = new URLSearchParams(window.location.search);
          p.set("page", String(prevIndex + 1));
          const prevHref = `${window.location.pathname}?${p.toString()}`;

          return (
            <a
              href={prevHref}
              onClick={(e) => {
                e.preventDefault();
                try {
                  const newUrl = `${window.location.pathname}?${p.toString()}`;
                  window.history.pushState({}, "", newUrl);
                } catch (err) {
                  // eslint-disable-next-line no-console
                  console.warn("Pagination: history.pushState failed", err);
                }
                if (typeof callBack === "function") callBack(prevIndex);
              }}
              className="wmcads-pagination__prev wmcads-link wmcads-link--with-chevron"
              aria-label="Go to previous page"
            >
              <svg className="wmcads-link__chevron wmcads-link__chevron--left">
                <use
                  xlinkHref="#wmcads-general-chevron-right"
                  href="#wmcads-general-chevron-right"
                ></use>
              </svg>{" "}
              Previous page
            </a>
          );
        })()
      ) : null}
      {activePageIndex + 1 < numberOfPages ? (
        (() => {
          const nextIndex = activePageIndex + 1;
          const p = new URLSearchParams(window.location.search);
          p.set("page", String(nextIndex + 1));
          const nextHref = `${window.location.pathname}?${p.toString()}`;

          return (
            <a
              href={nextHref}
              onClick={(e) => {
                e.preventDefault();
                try {
                  const newUrl = `${window.location.pathname}?${p.toString()}`;
                  window.history.pushState({}, "", newUrl);
                } catch (err) {
                  // eslint-disable-next-line no-console
                  console.warn("Pagination: history.pushState failed", err);
                }
                if (typeof callBack === "function") callBack(nextIndex);
              }}
              className="wmcads-pagination__next wmcads-link wmcads-link--with-chevron"
              aria-label="Go to next page"
            >
              Next page{" "}
              <svg className="wmcads-link__chevron wmcads-link__chevron--right">
                <use
                  xlinkHref="#wmcads-general-chevron-right"
                  href="#wmcads-general-chevron-right"
                ></use>
              </svg>
            </a>
          );
        })()
      ) : null}
    </div>
  );
};

Pagination.propTypes = {
  numberOfPages: PropTypes.number,
  activePage: PropTypes.number,
  callBack: PropTypes.func,
};

export default Pagination;
