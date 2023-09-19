import PropTypes from "prop-types";

const Search = ({
  placeholder,
  changeCallback,
  searchButtonClickedCallback,
}) => (
  <form className="wmcads-search-bar">
    <input
      aria-label="Search"
      type="text"
      className="wmcads-search-bar__input wmcads-fe-input"
      placeholder={placeholder}
      onChange={(e) => changeCallback(e.target.value)}
    />
    <button
      className="wmcads-search-bar__btn"
      type="submit"
      onClick={(e) => {
        e.preventDefault();
        searchButtonClickedCallback();
      }}
    >
      <svg>
        <title>Search</title>
        <use
          xlinkHref="#wmcads-general-search"
          href="#wmcads-general-search"
        ></use>
      </svg>
    </button>
  </form>
);

Search.propTypes = {
  placeholder: PropTypes.string,
  changeCallback: PropTypes.func,
  searchButtonClickedCallback: PropTypes.func,
};

Search.defaultProps = {
  changeCallback: () => {},
  searchButtonClickedCallback: () => {},
};

export default Search;
