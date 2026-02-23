import { useState, useEffect, useCallback } from "react";

import PropTypes from "prop-types";

import FilterByDateRange from "./FilterByDateRange";

const CheckOption = ({ inputName, option, optionSelected, optionSelectedFn }) => {
  const checked = optionSelectedFn(option.value) || false;

  

    return (
    <label className={`wmcads-fe-checkboxes__container ${option.disabled ? 'wmcads-is--disabled' : ''}`}>
      {option.label}
      <input
        name={inputName}
        className="wmcads-fe-checkboxes__input"
        value={option.value}
        type="checkbox"
        onChange={(e) => optionSelected(e.target.value)}
        onKeyDown={(e) => {
          if (option.disabled) return;
          if (e.key === "Enter") {
            e.preventDefault();
            optionSelected(option.value);
          }
        }}
        checked={checked}
        disabled={option.disabled || false}
      />
      <span className="wmcads-fe-checkboxes__checkmark">
        <svg className="wmcads-fe-checkboxes__icon" aria-hidden="true" focusable="false">
          <use
            xlinkHref="#wmcads-general-checkmark"
            href="#wmcads-general-checkmark"
          ></use>
        </svg>
      </span>
    </label>
  );
};

CheckOption.propTypes = {
  inputName: PropTypes.string,
  option: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
    disabled: PropTypes.bool,
  }),
  optionSelected: PropTypes.func,
  optionSelectedFn: PropTypes.func,
};

const RadioOption = ({ title, option, optionSelected, optionSelectedFn }) => {
  const checked = optionSelectedFn(option.value) || false;

  

  return (
    <label className={`wmcads-fe-radios__container ${option.disabled ? 'wmcads-is--disabled' : ''}`}>
      {option.label}
      <input
        className="wmcads-fe-radios__input"
        disabled={option.disabled || false}
        value={option.value}
        name={title}
        type="radio"
        onChange={(e) => optionSelected(e.target.value)}
        onKeyDown={(e) => {
          if (option.disabled) return;
          if (e.key === "Enter") {
            e.preventDefault();
            optionSelected(option.value);
          }
        }}
        checked={checked}
      />
      <span className="wmcads-fe-radios__checkmark" aria-hidden="true"></span>
    </label>
  );
};

RadioOption.propTypes = {
  title: PropTypes.string,
  option: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
    disabled: PropTypes.bool,
  }),
  optionSelected: PropTypes.func,
  optionSelectedFn: PropTypes.func,
};

const FilterAccordion = ({
  title = "",
  options = [],
  selectOne = false,
  optionSelected = () => {},
  optionSelectedFn = () => {},
  setDateRanges = () => {},
  clearFilters = false,
  filter = {},
  forceOpen = false,
}) => {
  const [accordionOpen, setAccordionOpen] = useState(!!forceOpen);
  const [dateAfter, setDateAfter] = useState({ day: "", month: "", year: "" });
  const [dateBefore, setDateBefore] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [afterErrors, setAfterErrors] = useState(undefined);
  const [beforeErrors, setBeforeErrors] = useState(undefined);
  const [isDate1BeforeDate2, setIsDate1BeforeDate2] = useState(undefined);
  const [dateRanges, setDateRanges2] = useState(undefined);
  const [urlset, setUrlSet] = useState(false);
  const [inputName] = useState(`input-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
  // unique id for accordion content to avoid duplicate IDs when multiple accordions are rendered
  const [contentId] = useState(() => `accordion-${inputName}`);

  const toggleAccordion = () => {
    // Allow the user to toggle the accordion even if `forceOpen` is true.
    // Previously we prevented closing when forced open; that made the UI
    // feel stuck. Keep `forceOpen` behavior (it will open the accordion when
    // set) but allow clicking to close it.
    setAccordionOpen(!accordionOpen);
  };

  useEffect(() => {
    // If forceOpen becomes true, ensure accordion is open. If clearFilters, close it.
    if (forceOpen) setAccordionOpen(true);
    if (clearFilters) setAccordionOpen(false);
  }, [forceOpen, clearFilters]);

  const receivedDateChange = (val, field, name) => {
    const updatedDateAfter = { ...dateAfter };
    const updatedDateBefore = { ...dateBefore };

    if (name === "AFTER") {
      if (!/[^0-9]/.test(val)) {
        updatedDateAfter[field] = val;
        setDateAfter(updatedDateAfter);
      }
    } else {
      if (!/[^0-9]/.test(val)) {
        updatedDateBefore[field] = val;
        setDateBefore(updatedDateBefore);
      }
    }
  };

  const otherThanUndefined = (obj) => {
    return Object.values(obj).some((value) => value !== undefined);
  };

  // validationMonthDay now accepts the computed isDate1BeforeDate2 value
  // as a parameter so it doesn't close over component state and can be
  // used inside effects without forcing them to re-run on error/state changes.
  const validationMonthDay = useCallback((updates, date, type, isBefore) => {
    let otherError = false;

    if (date.day === "") {
      updates.day = undefined;
    } else if (
      date.day < 1 ||
      date.day > new Date(date.year, date.month, 0).getDate()
    ) {
      otherError = true;
      updates.day = "Day is invalid";
    } else {
      updates.day = undefined;
    }

    if (date.month === "") {
      updates.month = undefined;
    } else if (date.month < 1 || date.month > 12) {
      otherError = true;
      updates.month = "Month is invalid";
    } else {
      updates.month = undefined;
    }

    if (type === "before" && isBefore) {
      updates.ToosGreaterThanFrom = undefined;
    } else if (type === "before" && isBefore === false) {
      updates.ToosGreaterThanFrom = "Date to must be greater than date from";
    }

    if (otherError) {
      updates.ToosGreaterThanFrom = undefined;
    }

    return updates;
  }, []);

  // Method get the date ranges from the URL and splits the string values back into the required object type before setting the local states
  const setDateValuesFromUrl = useCallback(() => {
    const to = filter?.dateRangeSet?.to.split("/");
    if (to?.length === 3) {
      const [year, month, day] = to;
      setDateBefore({ day, month, year });
    }

    const from = filter?.dateRangeSet?.from.split("/");
    if (from?.length === 3) {
      const [year, month, day] = from;
      setDateAfter({ day, month, year });
    }
  }, [filter, setDateBefore, setDateAfter]);

  useEffect(() => {
    const updatedDateAfter = { ...dateAfter };
    const updatedDateBefore = { ...dateBefore };

    const isAnyValueEmpty = () => {
      return (
        Object.values(updatedDateAfter).some((value) => !value) ||
        Object.values(updatedDateBefore).some((value) => !value)
      );
    };

    const yearInputContains4characters = () => {
      return (
        updatedDateAfter.year.length === 4 &&
        updatedDateBefore.year.length === 4
      );
    };

    const stringDateToNewDate = (dateString) => {
      // Replace / with - and ensure the month has two digits
      const formattedDateString = dateString.replace(
        /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
        (_, month, day, year) => {
          return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
        }
      );

      return new Date(formattedDateString);
    };

    // Only run validation when all fields are present and years are 4 characters
    if (!isAnyValueEmpty() && yearInputContains4characters()) {
      const afterDateString = `${dateAfter.year}/${dateAfter.month}/${dateAfter.day}`;
      const beforeDateString = `${dateBefore.year}/${dateBefore.month}/${dateBefore.day}`;

      const afterNewDate = stringDateToNewDate(afterDateString);
      const beforeNewDate = stringDateToNewDate(beforeDateString);

      // compute comparison once
      const newIsBefore = beforeNewDate >= afterNewDate;

      // only update boolean state when it actually changes
      setIsDate1BeforeDate2((prev) => (prev === newIsBefore ? prev : newIsBefore));

      const newDateRanges = { from: afterDateString, to: beforeDateString };
      setDateRanges2((prev) => {
        try {
          if (JSON.stringify(prev) === JSON.stringify(newDateRanges)) return prev;
        } catch (e) {
          // ignore circular/serialization errors
        }
        return newDateRanges;
      });

      const updatedBeforeErrorsSet = validationMonthDay(
        { ...beforeErrors },
        dateBefore,
        "before",
        newIsBefore
      );
      const updatedAfterErrorsSet = validationMonthDay(
        { ...afterErrors },
        dateAfter,
        "after",
        newIsBefore
      );

      setBeforeErrors((prev) => {
        try {
          if (JSON.stringify(prev) === JSON.stringify(updatedBeforeErrorsSet)) return prev;
        } catch (e) {
          // ignore circular/serialization errors
        }
        return updatedBeforeErrorsSet;
      });

      setAfterErrors((prev) => {
        try {
          if (JSON.stringify(prev) === JSON.stringify(updatedAfterErrorsSet)) return prev;
        } catch (e) {
          // ignore circular/serialization errors
        }
        return updatedAfterErrorsSet;
      });
    }
  }, [dateAfter, dateBefore, validationMonthDay, afterErrors, beforeErrors]);

  

  useEffect(() => {
    // Here we check the the dates are required and valid before we filter the articles
    if (
      !otherThanUndefined({ ...afterErrors }) &&
      !otherThanUndefined({ ...beforeErrors }) &&
      isDate1BeforeDate2
    ) {
      setDateRanges(dateRanges);
    }
  }, [dateRanges, afterErrors, beforeErrors, isDate1BeforeDate2, setDateRanges]);

  useEffect(() => {
    //Here is triggered when date ranges have been passed in via the URL
    if (filter?.dateRangeSet && !urlset) {
      setDateValuesFromUrl();
      setUrlSet(true);
    }

    // When clearing the filters we reset everything here related to the date range
    if (clearFilters) {
      setDateAfter({ day: "", month: "", year: "" });
      setDateBefore({ day: "", month: "", year: "" });
      setAfterErrors(undefined);
      setBeforeErrors(undefined);
      setDateRanges(undefined);
    }
  }, [clearFilters, filter?.dateRangeSet, setDateRanges, setDateValuesFromUrl, urlset]);

  return (
    <div
      className={`wmcads-accordion ${accordionOpen ? "wmcads-is--open" : null}`}
    >
      <button
        id={`${contentId}-button`}
        aria-controls={contentId}
        className="wmcads-accordion__summary-wrapper"
        aria-expanded={accordionOpen}
        onClick={toggleAccordion}
      >
        <div className="wmcads-accordion__summary">
          <h4 id={`${contentId}-label`} className="wmcads-accordion__summary-title wmcads-m-b-none">
            {title}
          </h4>
        </div>
        <svg className="wmcads-accordion__icon" aria-hidden="true" focusable="false">
          <use
            xlinkHref="#wmcads-general-expand"
            href="#wmcads-general-expand"
          ></use>
        </svg>{" "}
        <svg className="wmcads-accordion__icon wmcads-accordion__icon--minimise" aria-hidden="true" focusable="false">
          <use
            xlinkHref="#wmcads-general-minimise"
            href="#wmcads-general-minimise"
          ></use>
        </svg>
      </button>
  <div className="wmcads-accordion__content" id={contentId} role="region" aria-labelledby={`${contentId}-label`}>
        <fieldset className="wmcads-fe-fieldset">
          {/* Accessible label for the fieldset */}
          <legend className="visible-hidden">{title}</legend>
          <div
            className={`${
              selectOne ? "wmcads-fe-radios" : "wmcads-fe-checkboxes"
            }`}
          >
            {options.map((option) =>
              selectOne ? (
                <RadioOption
                  title={title}
                  option={option}
                  key={option.value}
                  optionSelected={optionSelected}
                  optionSelectedFn={optionSelectedFn}
                />
              ) : (
                <CheckOption
                  inputName={inputName}
                  option={option}
                  key={option.value}
                  optionSelected={optionSelected}
                  optionSelectedFn={optionSelectedFn}
                />
              )
            )}
          </div>
        </fieldset>
        {filter?.dates === "updatedByRange" && (
          <>
            <FilterByDateRange
              name="AFTER"
              title="Date From"
              handleDateChange={receivedDateChange}
              value={dateAfter}
              errors={afterErrors}
            />
            <FilterByDateRange
              name="BEFORE"
              title="Date To"
              handleDateChange={receivedDateChange}
              value={dateBefore}
              errors={beforeErrors}
            />
          </>
        )}
      </div>
    </div>
  );
};

FilterAccordion.propTypes = {
  title: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      disabled: PropTypes.bool,
    })
  ),
  selectOne: PropTypes.bool,
  optionSelected: PropTypes.func,
  optionSelectedFn: PropTypes.func,
  setDateRanges: PropTypes.func,
  clearFilters:
    PropTypes.bool /* This is a boolean value to determine if the filters should be cleared */,
  filter: PropTypes.shape({
    // You can change the PropTypes type based on your specific needs, Add other PropTypes for other properties in the filter object if necessary
    dates: PropTypes.string,
    dateRangeSet: PropTypes.object,
  }),
  forceOpen: PropTypes.bool,
};

// Defaults provided in the function signature to avoid using defaultProps on a function component

export default FilterAccordion;
