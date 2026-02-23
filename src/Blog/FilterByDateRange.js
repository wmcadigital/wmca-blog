import PropTypes from "prop-types";

const AddedAfter = ({ title, handleDateChange, value, name, errors }) => (
  <div
    id={`date-input-${(name || "").toString().replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase() || "date"}`}
    className={`wmcads-fe-group ${
      (errors && errors.day !== undefined) ||
      (errors && errors.month !== undefined) ||
      (errors && errors.ToosGreaterThanFrom !== undefined)
        ? "wmcads-fe-group--error"
        : ""
    }`}
  >
    <h5>{title}</h5>

    <div className="wmcads-fe-date-input">
      {errors && errors.ToosGreaterThanFrom !== undefined && (
        <span className="wmcads-fe-error-message">
          {errors.ToosGreaterThanFrom}
        </span>
      )}
      {errors && errors.day !== undefined && (
        <span className="wmcads-fe-error-message">{errors.day}</span>
      )}
      {errors && errors.month !== undefined && (
        <span className="wmcads-fe-error-message">{errors.month}</span>
      )}
      <div className="wmcads-fe-date-input__day">
        <label className="wmcads-fe-label" htmlFor={`date-input-${(name || "").toString().replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase() || "date"}_LastUsedDateDay`}>
          Day
        </label>
        <input
          className={`wmcads-fe-input ${
            errors && errors.day !== undefined ? "wmcads-fe-input--error" : ""
          }`}
          onChange={(e) => handleDateChange(e.target.value, "day", name)}
          id={`date-input-${(name || "").toString().replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase() || "date"}_LastUsedDateDay`}
          inputMode="numeric"
          value={value.day}
          name="date-input"
          type="text"
          maxLength="2"
          pattern="[0-9]*"
        />
      </div>
      <div className="wmcads-fe-date-input__month">
        <label className="wmcads-fe-label" htmlFor={`date-input-${(name || "").toString().replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase() || "date"}_LastUsedDateMonth`}>
          Month
        </label>
        <input
          className={`wmcads-fe-input ${
            errors && errors.month !== undefined ? "wmcads-fe-input--error" : ""
          }`}
          onChange={(e) => handleDateChange(e.target.value, "month", name)}
          id={`date-input-${(name || "").toString().replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase() || "date"}_LastUsedDateMonth`}
          inputMode="numeric"
          value={value.month}
          name="date-input"
          type="text"
          maxLength="2"
          pattern="[0-9]*"
        />
      </div>
      <div className="wmcads-fe-date-input__year">
        <label className="wmcads-fe-label" htmlFor={`date-input-${(name || "").toString().replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase() || "date"}_LastUsedDateYear`}>
          Year
        </label>
        <input
          className={`wmcads-fe-input`}
          onChange={(e) => handleDateChange(e.target.value, "year", name)}
          id={`date-input-${(name || "").toString().replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase() || "date"}_LastUsedDateYear`}
          inputMode="numeric"
          value={value.year}
          name="date-input"
          type="text"
          maxLength="4"
          pattern="[0-9]*"
        />
      </div>
    </div>
  </div>
);

AddedAfter.propTypes = {
  title: PropTypes.string,
  name: PropTypes.string,
  handleDateChange: PropTypes.func,
  value: PropTypes.object,
  errors: PropTypes.object,
};

const FilterByDateRange = ({
  name = "",
  title = "",
  handleDateChange = () => {},
  value = { day: "", month: "", year: "" },
  errors = undefined,
}) => {
  return (
    <div>
      <AddedAfter
        name={name}
        value={value}
        title={title}
        key={name || ""}
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
  errors: PropTypes.object,
};

// Defaults provided in the function signature to avoid using defaultProps on a function component

export default FilterByDateRange;
