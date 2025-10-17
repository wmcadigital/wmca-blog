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
            >
              {index === activePage ? (
                index + 1
              ) : (
                <a
                  className="wmcads-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    callBack(index);
                  }}
                  aria-label={`Go to page ${index + 1}`}
                >
                  {index + 1}
                </a>
              )}
            </li>
          );
        })}
      </ol>
      {activePage !== 0 ? (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            callBack(activePage - 1);
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
      ) : null}
      {activePage + 1 < numberOfPages ? (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            callBack(activePage + 1);
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
