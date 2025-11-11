import React, { useState } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import './QuestionPanel.css';

/**
 * MEMBER 3: Question Panel Component (Admin Side)
 * Displays question bank and current question status
 */
const QuestionPanel = ({ questions, currentQuestionIndex, onBroadcast, onSkip }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(currentQuestionIndex);

  const getQuestionStatus = (index) => {
    if (index < currentQuestionIndex) return 'sent';
    if (index === currentQuestionIndex) return 'current';
    if (index === currentQuestionIndex + 1) return 'next';
    return 'pending';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return '✓';
      case 'current': return '➤';
      case 'next': return '⏳';
      case 'pending': return '⏸️';
      default: return '';
    }
  };

  const getStatusClass = (status) => {
    return `question-status-${status}`;
  };

  return (
    <Card title="Question Bank" className="question-panel">
      <div className="question-list">
        {questions.map((question, index) => {
          const status = getQuestionStatus(index);
          return (
            <div
              key={question.id}
              className={`question-item ${getStatusClass(status)} ${
                selectedQuestion === index ? 'selected' : ''
              }`}
              onClick={() => setSelectedQuestion(index)}
            >
              <div className="question-number">Q{index + 1}</div>
              <div className="question-preview">
                <span className="question-text">{question.text}</span>
                <span className="question-status-badge">
                  {getStatusIcon(status)} {status.toUpperCase()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedQuestion !== null && (
        <div className="question-details">
          <h4>Selected Question:</h4>
          <p className="detail-text">{questions[selectedQuestion]?.text}</p>
          <div className="detail-info">
            <span>Time Limit: {questions[selectedQuestion]?.timeLimit}s</span>
            <span>Options: {questions[selectedQuestion]?.options?.length}</span>
          </div>
        </div>
      )}

      <div className="question-controls">
        <Button
          variant="primary"
          onClick={() => onBroadcast(selectedQuestion)}
          disabled={selectedQuestion !== currentQuestionIndex}
        >
          📡 Broadcast Current
        </Button>
        <Button
          variant="secondary"
          onClick={() => onSkip()}
          disabled={currentQuestionIndex >= questions.length - 1}
        >
          ⏭️ Skip
        </Button>
      </div>
    </Card>
  );
};

export default QuestionPanel;
