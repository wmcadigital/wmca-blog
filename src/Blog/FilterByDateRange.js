
import PropTypes from "prop-types";

const AddedAfter = ({ title, handleDateChange, value, name }) => (
  <div id="date-input" className="wmcads-fe-group">
    <h5>{title}</h5>
    <div className="wmcads-fe-date-input">
      <div className="wmcads-fe-date-input__day">
        <label className="wmcads-fe-label" htmlFor="LastUsedDateDay">Day</label>
        <input className="wmcads-fe-input" onChange={(e) => handleDateChange(e.target.value, 'day', name)} id="date-input_LastUsedDateDay" inputMode="numeric" value={value.day} name="date-input" type="text" maxLength="2" pattern="[0-9]*"/>
      </div>
      <div className="wmcads-fe-date-input__month">
        <label className="wmcads-fe-label" htmlFor="LastUsedDateMonth">Month</label>
        <input className="wmcads-fe-input" onChange={(e) => handleDateChange(e.target.value, 'month', name)} id="date-input_LastUsedDateMonth" inputMode="numeric" value={value.month} name="date-input" type="text" maxLength="2" pattern="[0-9]*"/>
      </div>
      <div className="wmcads-fe-date-input__year">
        <label className="wmcads-fe-label" htmlFor="LastUsedDateYear">Year</label>
        <input className="wmcads-fe-input" onChange={(e) => handleDateChange(e.target.value, 'year', name)} id="date-input_LastUsedDateYear" inputMode="numeric" value={value.year} name="date-input" type="text" maxLength="4" pattern="[0-9]*"/>
      </div>
    </div>
  </div>
);

AddedAfter.propTypes = {
  title: PropTypes.string,
  name: PropTypes.string,
  handleDateChange: PropTypes.func,
  value: PropTypes.object,
};

const FilterByDateRange = ({
  name,
  title,
  handleDateChange,
  value,
}) => {

  return (
    <div>
      <AddedAfter
        name={name}
        value={value}
        title={title}
        key={[]}
        handleDateChange={handleDateChange}
      />
    </div>
  );
};

FilterByDateRange.propTypes = {
  title: PropTypes.string,
  name: PropTypes.string,
  handleDateChange: PropTypes.func,
  value: PropTypes.object
};

FilterByDateRange.defaultProps = {
  title: '',
  name: '',
};

export default FilterByDateRange;
