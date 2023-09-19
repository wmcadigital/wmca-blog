import { useState } from "react";

import PropTypes from "prop-types";

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
  <label className="wmcads-fe-radios__container">
    {option.label}
    <input
      className="wmcads-fe-radios__input"
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
  option: PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
  optionSelected: PropTypes.func,
  optionSelectedFn: PropTypes.func,
};

const FilterAccordion = ({
  title,
  options,
  selectOne,
  optionSelected,
  optionSelectedFn,
}) => {
  const [accordionOpen, setAccordionOpen] = useState(true);

  const toggleAccordion = () => setAccordionOpen(!accordionOpen);

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
      </div>
    </div>
  );
};

FilterAccordion.propTypes = {
  title: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
  ),
  selectOne: PropTypes.bool,
  optionSelected: PropTypes.func,
  optionSelectedFn: PropTypes.func,
};

FilterAccordion.defaultProps = {
  options: [],
  optionSelected: () => {},
  optionSelectedFn: () => {},
};

export default FilterAccordion;
