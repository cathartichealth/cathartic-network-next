import React, { useState } from 'react';

const Accordion = ({ title, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="rounded-md overflow-hidden border border-purple-800">
      <div
        className={`p-4 cursor-pointer bg-purple-800 text-white text-center`}
        onClick={toggleAccordion}
      >
        {title}
      </div>
      {isOpen && (
        <div className="bg-white text-black border-t border-purple-800 p-4 text-center">
          {description}
        </div>
      )}
    </div>
  );
};

export default Accordion;
