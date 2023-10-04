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
  selectedDate,
  setDateRanges
}) => {
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [dateAfter, setDateAfter] = useState({ day: '', month: '', year: '' });
  const [dateBefore, setDateBefore] = useState({ day: '', month: '', year: '' });
  const [errors, setErrors] = useState(undefined);

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
      const afterDateObject = new Date(afterDateString)

      const beforeDateString = `${dateBefore.year}/${dateBefore.month}/${dateBefore.day}`
      const beforeDateObject = new Date(beforeDateString)

      // before should be greater than after
      const isDate1BeforeDate2 = beforeDateObject > afterDateObject;

      const dateRanges = {
        from: afterDateObject,
        to: beforeDateObject
      };

      if (isDate1BeforeDate2) {
        setErrors(undefined)
        setDateRanges(dateRanges)
      } else {
        setErrors('Date to must be greater than date from')
      }
    }
  }, [dateAfter, dateBefore]);

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
        {selectedDate === 'updatedByRange' && 
          <>
            <FilterByDateRange
              name="AFTER"
              title='Date From'
              handleDateChange={receivedDateChange}
              value={dateAfter}
            />
            <FilterByDateRange
              name="BEFORE"
              title='Date To' 
              handleDateChange={receivedDateChange}
              value={dateBefore}
              errors={errors}
          
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
  selectedDate: PropTypes.string,
  setDateRanges: PropTypes.func,
};

FilterAccordion.defaultProps = {
  options: [],
  optionSelected: () => {},
  optionSelectedFn: () => {},
  setDateRanges: () => { },
};

export default FilterAccordion;
