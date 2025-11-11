import React from 'react';
import './OptionsList.css';

/**
 * MEMBER 2: Options List Component
 * Displays answer options with selection functionality
 */
const OptionsList = ({ options, selectedOption, onSelect, disabled }) => {
  return (
    <div className="options-list">
      {options.map((option, index) => (
        <div
          key={index}
          className={`option-item ${selectedOption === index ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={() => !disabled && onSelect(index)}
        >
          <div className="option-radio">
            {selectedOption === index && <div className="radio-dot"></div>}
          </div>
          <div className="option-label">{String.fromCharCode(65 + index)}</div>
          <div className="option-text">{option}</div>
        </div>
      ))}
    </div>
  );
};

export default OptionsList;
