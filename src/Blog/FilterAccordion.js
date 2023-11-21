import { useState, useEffect } from "react";

import PropTypes from "prop-types";

import FilterByDateRange from "./FilterByDateRange";

const CheckOption = ({ option, optionSelected, optionSelectedFn }) => (
  <label className="wmcads-fe-checkboxes__container">
    {option.label}
    <input
      className="wmcads-fe-checkboxes__input"
      value={option.value}
      type="checkbox"
      onChange={(e) => optionSelected(e.target.value)}
      checked={optionSelectedFn(option.value) || false}
    />
    <span className="wmcads-fe-checkboxes__checkmark">
      <svg className="wmcads-fe-checkboxes__icon">
        <use
          xlinkHref="#wmcads-general-checkmark"
          href="#wmcads-general-checkmark"
        ></use>
      </svg>
    </span>
  </label>
);

CheckOption.propTypes = {
  option: PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
  optionSelected: PropTypes.func,
  optionSelectedFn: PropTypes.func,
};

const RadioOption = ({ title, option, optionSelected, optionSelectedFn }) => (
  <label className={`wmcads-fe-radios__container ${!option.disabled ? 'disabled' : ''}`} >
    {option.label}
    <input
      className="wmcads-fe-radios__input"
      disabled={!option.disabled}
      value={option.value}
      name={title}
      type="radio"
      onChange={(e) => optionSelected(e.target.value)}
      checked={optionSelectedFn(option.value) || false}
    />
    <span className="wmcads-fe-radios__checkmark"></span>
  </label>
);

RadioOption.propTypes = {
  title: PropTypes.string,
  option: PropTypes.shape({ label: PropTypes.string, value: PropTypes.string, disabled: PropTypes.bool }),
  optionSelected: PropTypes.func,
  optionSelectedFn: PropTypes.func,
};

const FilterAccordion = ({
  title,
  options,
  selectOne,
  optionSelected,
  optionSelectedFn,
  setDateRanges,
  filter
}) => {
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [dateAfter, setDateAfter] = useState({ day: '', month: '', year: '' });
  const [dateBefore, setDateBefore] = useState({ day: '', month: '', year: '' });
  const [afterErrors, setAfterErrors] = useState(undefined);
  const [beforeErrors, setBeforeErrors] = useState(undefined);
  const [isDate1BeforeDate2, setIsDate1BeforeDate2] = useState(undefined);
  const [dateRanges, setDateRanges2] = useState(undefined);
  const [urlset, setUrlSet] = useState(false);

  const toggleAccordion = () => setAccordionOpen(!accordionOpen);

  const receivedDateChange = (val, field, name) => {
    const updatedDateAfter = { ...dateAfter };
    const updatedDateBefore = { ...dateBefore };

    if (name === 'AFTER') { 
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
  }

  const otherThanUndefined = (obj) => {
    return Object.values(obj).some(value => value !== undefined);
  }

  const validationMonthDay = (updates, date, type) => {

    let otherError = false;

    if (date.day === '') {
      updates.day = undefined;
    } else if (
      date.day < 1 ||
      date.day > new Date(date.year, date.month, 0).getDate()) {
      otherError = true
      updates.day = 'Day is invalid';
    } else {
      updates.day = undefined;
    }

    if (date.month === '') {
      updates.month = undefined;
    } else if (date.month < 1 || date.month > 12) {
      otherError = true
      updates.month = 'Month is invalid';
    } else {
      updates.month = undefined;
    }

    if (type === 'before' && isDate1BeforeDate2) {
      updates.ToosGreaterThanFrom = undefined;
    } else if (type === 'before' && isDate1BeforeDate2 === false) {
      updates.ToosGreaterThanFrom = 'Date to must be greater than date from';
    }

    if (otherError) {
      updates.ToosGreaterThanFrom = undefined
    }

    return updates
  }

  // Method get the date ranges from the URL and splits the string values back into the required object type before setting the local states
  const setDateValuesFromUrl = () => {
    const to = filter?.dateRangeSet?.to.split('/');
    if (to?.length === 3) {
      const [year, month, day] = to;
      setDateBefore({ day, month, year });
    }

    const from = filter?.dateRangeSet?.from.split('/');
    if (from?.length === 3) {
      const [year, month, day] = from;
      setDateAfter({ day, month, year });
    }
  }


  useEffect(() => {

    const updatedDateAfter = { ...dateAfter };
    const updatedDateBefore = { ...dateBefore };

    const isAnyValueEmpty = () => {
      return Object.values(updatedDateAfter).some(value => !value) || Object.values(updatedDateBefore).some(value => !value)
    };

    const yearInputContains4characters = () => {
      return updatedDateAfter.year.length === 4 && updatedDateBefore.year.length === 4
    }

    // If false no fields are empty && yearly charachters are 4 
    if (!isAnyValueEmpty() && yearInputContains4characters()) {
      const afterDateString = `${dateAfter.year}/${dateAfter.month}/${dateAfter.day}`
      const beforeDateString = `${dateBefore.year}/${dateBefore.month}/${dateBefore.day}`

      // before should be greater than after
      setIsDate1BeforeDate2(beforeDateString >= afterDateString);
      setDateRanges2({ from: afterDateString, to: beforeDateString });


      const updatedBeforeErrorsSet = validationMonthDay({ ...beforeErrors }, dateBefore, 'before')
      const updatedAfterErrorsSet = validationMonthDay({ ...afterErrors }, dateAfter, 'after')
  
      setBeforeErrors(updatedBeforeErrorsSet);
      setAfterErrors(updatedAfterErrorsSet);  
    }
  }, [dateAfter, dateBefore, isDate1BeforeDate2]);

  useEffect(() => {

  }, [])
  
  
  useEffect(() => {
    // Here we check the the dates are required and valid before we filter the articles 
    if (!otherThanUndefined({ ...afterErrors }) && !otherThanUndefined({ ...beforeErrors }) && isDate1BeforeDate2) {
        setDateRanges(dateRanges);
    }
  }, [dateRanges])

  useEffect(() => { 

    //Here is triggered when date ranges have been passed in via the URL
    if (filter?.dateRangeSet && !urlset) {
      setDateValuesFromUrl()
      setUrlSet(true)
    }

    // When clearing the filters we reset everything here related to the date range 
    if (filter?.resets) {
      setDateAfter({ day: '', month: '', year: '' })
      setDateBefore({ day: '', month: '', year: '' })
      setAfterErrors(undefined)
      setBeforeErrors(undefined)
      setDateRanges(undefined)
    }

  }, [filter?.resets, filter?.dateRangeSet])


  return (
    <div
      className={`wmcads-accordion ${accordionOpen ? "wmcads-is--open" : null}`}
    >
      <button
        aria-controls="accordion-Topic"
        className="wmcads-accordion__summary-wrapper"
        aria-expanded="true"
        onClick={toggleAccordion}
      >
        <div className="wmcads-accordion__summary">
          <h4 className="wmcads-accordion__summary-title wmcads-m-b-none">
            {title}
          </h4>
        </div>
        <svg className="wmcads-accordion__icon">
          <use
            xlinkHref="#wmcads-general-expand"
            href="#wmcads-general-expand"
          ></use>
        </svg>{" "}
        <svg className="wmcads-accordion__icon wmcads-accordion__icon--minimise">
          <use
            xlinkHref="#wmcads-general-minimise"
            href="#wmcads-general-minimise"
          ></use>
        </svg>
      </button>
      <div className="wmcads-accordion__content" id="accordion-Topic">
        <fieldset className="wmcads-fe-fieldset">
          <div
            className={`${
              selectOne ? "wmcads-fe-checkboxes" : "wmcads-fe-radios"
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
                  option={option}
                  key={option.value}
                  optionSelected={optionSelected}
                  optionSelectedFn={optionSelectedFn}
                />
              )
            )}
          </div>
        </fieldset>
        {filter?.dates === 'updatedByRange' && 
          <>
            <FilterByDateRange
              name="AFTER"
              title='Date From'
              handleDateChange={receivedDateChange}
              value={dateAfter}
              errors={afterErrors}
            />
            <FilterByDateRange
              name="BEFORE"
              title='Date To' 
              handleDateChange={receivedDateChange}
              value={dateBefore}
              errors={beforeErrors}
            />
          </>
        }
      </div>
    </div>
  );
};

FilterAccordion.propTypes = {
  title: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string, disabled: PropTypes.bool })
  ),
  selectOne: PropTypes.bool,
  optionSelected: PropTypes.func,
  optionSelectedFn: PropTypes.func,
  setDateRanges: PropTypes.func,
  filter: PropTypes.shape({
    // You can change the PropTypes type based on your specific needs, Add other PropTypes for other properties in the filter object if necessary
    resets: PropTypes.bool,
    dates: PropTypes.string,
    dateRangeSet: PropTypes.object,
  })
};

FilterAccordion.defaultProps = {
  options: [],
  optionSelected: () => {},
  optionSelectedFn: () => {},
  setDateRanges: () => { },
};

export default FilterAccordion;


