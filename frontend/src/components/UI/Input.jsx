import React from 'react';
import './Input.css';

/**
 * Reusable Input Component
 */
const Input = ({ 
  type = 'text', 
  placeholder = '', 
  value, 
  onChange, 
  label, 
  error,
  className = '' 
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input-field ${error ? 'input-error' : ''}`}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Input;
