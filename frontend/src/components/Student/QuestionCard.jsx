import React from 'react';
import Card from '../UI/Card';
import './QuestionCard.css';

/**
 * MEMBER 2: Question Card Component
 * Displays the current question
 */
const QuestionCard = ({ questionNumber, questionText, timeLimit }) => {
  return (
    <Card className="question-card">
      <div className="question-header">
        <span className="question-number">Question {questionNumber}</span>
        <span className="time-limit">⏱️ {timeLimit}s</span>
      </div>
      <div className="question-text">
        {questionText}
      </div>
    </Card>
  );
};

export default QuestionCard;
