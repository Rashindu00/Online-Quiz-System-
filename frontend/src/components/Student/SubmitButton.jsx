import React from 'react';
import Button from '../UI/Button';
import './SubmitButton.css';

/**
 * MEMBER 2: Submit Button Component
 * Button for submitting answers
 */
const SubmitButton = ({ onSubmit, disabled, isSubmitting }) => {
  return (
    <div className="submit-button-container">
      <Button
        variant="primary"
        onClick={onSubmit}
        disabled={disabled || isSubmitting}
        className="submit-answer-btn"
      >
        {isSubmitting ? (
          <>
            <div className="button-spinner"></div>
            Submitting...
          </>
        ) : (
          '📝 Submit Answer'
        )}
      </Button>
    </div>
  );
};

export default SubmitButton;
