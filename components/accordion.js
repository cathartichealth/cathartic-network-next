import React, { useState } from 'react';

const Accordion = ({ title, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`accordion ${isOpen ? 'open' : ''}`}>
      <div className="accordion-title" onClick={toggleAccordion}>
        {title}
      </div>
      {isOpen && <div className="accordion-description">{description}</div>}
    </div>
  );
};

export default Accordion;
