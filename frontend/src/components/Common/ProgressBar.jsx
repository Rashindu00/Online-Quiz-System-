import React from 'react';
import './ProgressBar.css';

/**
 * MEMBER 5: Progress Bar Component
 * Shows quiz progress with visual indicator
 */
const ProgressBar = ({ current, total, label }) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  const getProgressColor = () => {
    if (percentage < 33) return 'progress-low';
    if (percentage < 66) return 'progress-medium';
    return 'progress-high';
  };

  return (
    <div className="progress-bar-container">
      {label && (
        <div className="progress-label">
          <span>{label}</span>
          <span className="progress-count">
            {current} / {total}
          </span>
        </div>
      )}

      <div className="progress-bar-wrapper">
        <div className="progress-bar-track">
          <div
            className={`progress-bar-fill ${getProgressColor()}`}
            style={{ width: `${percentage}%` }}
          >
            <span className="progress-percentage">{percentage}%</span>
          </div>
        </div>
      </div>

      <div className="progress-milestones">
        {Array.from({ length: total }, (_, index) => (
          <div
            key={index}
            className={`milestone ${index < current ? 'completed' : ''} ${
              index === current ? 'current' : ''
            }`}
          >
            {index < current ? '✓' : index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
