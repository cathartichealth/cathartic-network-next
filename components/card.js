// components/Card.js
import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ title, children }) => {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-content">
        <div className="accordion-container">{children}</div>
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}; 

export default Card;
