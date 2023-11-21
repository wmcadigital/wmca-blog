import PropTypes from "prop-types";
import React, { useState } from 'react';

const Accordion = ({ title, isOpenByDefault, content, index }) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);

  const toggleAccordion = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  return (
    <div className={`wmcads-accordion ${isOpen ? 'wmcads-is--open' : ''}`}>
      <button
        onClick={toggleAccordion}
        aria-controls={`accordion-${index}`}
        className="wmcads-accordion__summary-wrapper"
        aria-expanded={isOpen}
      >
        {/* accordion summary */}
        <div className="wmcads-accordion__summary">
          <h4 className="wmcads-m-b-none">{title}</h4>
        </div>
        {/* plus icon */}
        <svg className="wmcads-accordion__icon">
          <use xlinkHref="#wmcads-general-expand" href="#wmcads-general-expand"></use>
        </svg>
        {/* minus icon */}
        <svg className="wmcads-accordion__icon wmcads-accordion__icon--minimise">
          <use xlinkHref="#wmcads-general-minimise" href="#wmcads-general-minimise"></use>
        </svg>
      </button>

      {/* accordion content */}
      <div className="wmcads-accordion__content" id={`accordion-${index}`}>
        <p dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

const AccordionComponent = ({ data }) => {
  return (
    <div>
      {data.map((item, index) => (
        <Accordion key={index} index={index} title={item.content.properties.accordionTitle} isOpenByDefault={false} content={item.content.properties.accordionContent.markup} />
      ))}
    </div>
  );
};


AccordionComponent.propTypes = {
  content: PropTypes.string,
  data: PropTypes.array,
  isOpenByDefault: PropTypes.bool,
};

Accordion.propTypes = {
  index: PropTypes.number,
  content: PropTypes.string,
  isOpenByDefault: PropTypes.bool,
  title: PropTypes.string,
};

export default AccordionComponent;
