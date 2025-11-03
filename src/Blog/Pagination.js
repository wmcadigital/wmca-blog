import PropTypes from "prop-types";
import React from "react";

const Pagination = ({ numberOfPages, activePage, callBack }) => {
  const paginationArray = new Array(numberOfPages).fill(null);

  return (
    <div className="wmcads-pagination">
      <ol className="wmcads-pagination__nav">
        {paginationArray.map((_, index) => {
          return (
            <li
              key={index}
              className={`wmcads-pagination__item ${
                index === activePage ? "wmcads-pagination__item--active" : null
              } ${
                index === activePage - 1
                  ? "wmcads-pagination__item--previous"
                  : null
              }`}
              aria-current={index === activePage ? "page" : undefined}
            >
              {index === activePage ? (
                index + 1
              ) : (
                <button
                  type="button"
                  className="wmcads-link"
                  onClick={() => callBack(index)}
                  aria-label={`Go to page ${index + 1}`}
                >
                  {index + 1}
                </button>
              )}
            </li>
          );
        })}
      </ol>
      {activePage !== 0 ? (
        <button
          type="button"
          onClick={() => callBack(activePage - 1)}
          className="wmcads-pagination__prev wmcads-link wmcads-link--with-chevron"
          aria-label="Go to previous page"
        >
          <svg aria-hidden="true" focusable="false" className="wmcads-link__chevron wmcads-link__chevron--left">
              <use
                xlinkHref="#wmcads-general-chevron-right"
                href="#wmcads-general-chevron-right"
              ></use>
            </svg>{" "}
          Previous page
        </button>
      ) : null}
      {activePage + 1 < numberOfPages ? (
        <button
          type="button"
          onClick={() => callBack(activePage + 1)}
          className="wmcads-pagination__next wmcads-link wmcads-link--with-chevron"
          aria-label="Go to next page"
        >
          Next page{" "}
          <svg aria-hidden="true" focusable="false" className="wmcads-link__chevron wmcads-link__chevron--right">
              <use
                xlinkHref="#wmcads-general-chevron-right"
                href="#wmcads-general-chevron-right"
              ></use>
            </svg>
        </button>
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
