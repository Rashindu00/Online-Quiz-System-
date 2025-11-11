import React from 'react';
import './Card.css';

/**
 * Reusable Card Component
 */
const Card = ({ children, title, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {title && <div className="card-title">{title}</div>}
      <div className="card-content">{children}</div>
    </div>
  );
};

export default Card;
