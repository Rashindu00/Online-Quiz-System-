import React, { useState, useEffect } from 'react';
import './QuestionTimer.css';

/**
 * MEMBER 3: Question Timer Component
 * Countdown timer with visual urgency indicators
 */
const QuestionTimer = ({ timeLimit, onTimeUp, isActive = true }) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  useEffect(() => {
    setTimeRemaining(timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp]);

  const getTimerClass = () => {
    if (timeRemaining <= 5) return 'timer-critical';
    if (timeRemaining <= 15) return 'timer-warning';
    return 'timer-normal';
  };

  const getTimerIcon = () => {
    if (timeRemaining <= 5) return '🔴';
    if (timeRemaining <= 15) return '🟠';
    return '⏱️';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = (timeRemaining / timeLimit) * 100;

  return (
    <div className={`question-timer ${getTimerClass()}`}>
      <div className="timer-icon">{getTimerIcon()}</div>
      <div className="timer-content">
        <div className="timer-display">
          {formatTime(timeRemaining)}
        </div>
        <div className="timer-bar">
          <div
            className="timer-bar-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      {timeRemaining <= 10 && (
        <div className="timer-warning-text">
          Hurry up!
        </div>
      )}
    </div>
  );
};

export default QuestionTimer;
