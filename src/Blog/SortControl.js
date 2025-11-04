import PropTypes from "prop-types";

const SortControl = ({
  filter = { sort: "", topics: [], author: [], dates: null },
  setFilter = () => {},
  defaultVal = "q",
  sortChangedCallback = () => {},
}) => (
  <div className="wmcads-search-sort wmcads-fe-group">
    <label className="wmcads-fe-label" htmlFor="dropdown">
      <h3>Sort by</h3>
    </label>
    <div className="wmcads-fe-dropdown">
      <select
        className="wmcads-fe-dropdown__select"
        id="dropdown"
        name="dropdown"
        defaultValue={defaultVal}
        // onChange={(e) => sortChangedCallback(e.target.value)}
        onChange={(e) => {
          const val = e.target.value;
          if (typeof sortChangedCallback === "function") sortChangedCallback(val);
          setFilter({ ...filter, sort: val });
        }}
      >
        <option value="descending">Most recent</option>
        <option value="ascending">Oldest</option>
        {/* <option value="name">Name</option> */}
      </select>
    </div>
  </div>
);

SortControl.propTypes = {
  filter: PropTypes.object,
  setFilter: PropTypes.func,
  sortChangedCallback: PropTypes.func,
  defaultVal: PropTypes.string,
};

// Note: default props are provided via function default parameters above.

export default SortControl;
