import PropTypes from "prop-types";

const SortControl = ({ filter, setFilter, sortChangedCallback, defaultVal }) => (
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
        onChange={(e) =>
          setFilter({ ...filter, sort: e.target.value })
        }
      >
        <option value="">Choose from list</option>
        <option value="descending">Most recent</option>
        <option value="ascending">Oldest</option>
        <option value="name">Name</option>
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

SortControl.defaultProps = {
  filter: { sort: "", topics: [], author: [], dates: null },
  setFilter: () => {},
  sortChangedCallback: () => {},
  defaultVal: "q",
};

export default SortControl;
