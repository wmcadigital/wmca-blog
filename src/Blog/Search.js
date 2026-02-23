import PropTypes from "prop-types";
import { useState } from "react";

const Search = ({
  placeholder,
  changeCallback = () => {},
  searchButtonClickedCallback = () => {},
}) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // notify parent with the current input value
    changeCallback(value);
    // call the optional button-click handler
    searchButtonClickedCallback();
  };

  return (
    <form className="wmcads-search-bar" onSubmit={handleSubmit}>
      <label className="visible-hidden" htmlFor="search">
        Blog Search
      </label>
      <input
        name="search"
        id="search"
        type="text"
        className="wmcads-search-bar__input wmcads-fe-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="wmcads-search-bar__btn"
        type="submit"
        aria-label="Execute search"
      >
        <svg aria-hidden="true" focusable="false">
          <title>Search</title>
          <use
            xlinkHref="#wmcads-general-search"
            href="#wmcads-general-search"
          ></use>
        </svg>
      </button>
    </form>
  );
};

Search.propTypes = {
  placeholder: PropTypes.string,
  changeCallback: PropTypes.func,
  searchButtonClickedCallback: PropTypes.func,
};

// default parameter values above replace the previous use of defaultProps

export default Search;
