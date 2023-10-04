
import PropTypes from "prop-types";

const AddedAfter = ({ title, handleDateChange, value, name, errors }) => (
  <div id="date-input" className={`wmcads-fe-group ${errors !== undefined ? 'wmcads-fe-group--error' : ''}`}>
    <h5>{title}</h5>
    <div className="wmcads-fe-date-input">
      {errors !== undefined && (
        <span className="wmcads-fe-error-message">{errors}</span>
      )}
      
      <div className="wmcads-fe-date-input__day">
        <label className="wmcads-fe-label" htmlFor="LastUsedDateDay">Day</label>
        <input className={`wmcads-fe-input ${errors !== undefined ? 'wmcads-fe-input--error' : '' }`} onChange={(e) => handleDateChange(e.target.value, 'day', name)} id="date-input_LastUsedDateDay" inputMode="numeric" value={value.day} name="date-input" type="text" maxLength="2" pattern="[0-9]*"/>
      </div>
      <div className="wmcads-fe-date-input__month">
        <label className="wmcads-fe-label" htmlFor="LastUsedDateMonth">Month</label>
        <input className={`wmcads-fe-input ${errors !== undefined ? 'wmcads-fe-input--error' : '' }`} onChange={(e) => handleDateChange(e.target.value, 'month', name)} id="date-input_LastUsedDateMonth" inputMode="numeric" value={value.month} name="date-input" type="text" maxLength="2" pattern="[0-9]*"/>
      </div>
      <div className="wmcads-fe-date-input__year">
        <label className="wmcads-fe-label" htmlFor="LastUsedDateYear">Year</label>
        <input className={`wmcads-fe-input ${errors !== undefined ? 'wmcads-fe-input--error' : '' }`} onChange={(e) => handleDateChange(e.target.value, 'year', name)} id="date-input_LastUsedDateYear" inputMode="numeric" value={value.year} name="date-input" type="text" maxLength="4" pattern="[0-9]*"/>
      </div>
    </div>
  </div>
);

AddedAfter.propTypes = {
  title: PropTypes.string, 
  name: PropTypes.string,
  handleDateChange: PropTypes.func,
  value: PropTypes.object,
  errors: PropTypes.string,
};

const FilterByDateRange = ({
  name,
  title,
  handleDateChange,
  value,
  errors,
}) => {

  return (
    <div>
      <AddedAfter
        name={name}
        value={value}
        title={title}
        key={[]}
        handleDateChange={handleDateChange}
        errors={errors}
      />
    </div>
  );
};

FilterByDateRange.propTypes = {
  title: PropTypes.string,
  name: PropTypes.string,
  handleDateChange: PropTypes.func,
  value: PropTypes.object,
  errors: PropTypes.string
};

FilterByDateRange.defaultProps = {
  title: '',
  name: '',
};

export default FilterByDateRange;
