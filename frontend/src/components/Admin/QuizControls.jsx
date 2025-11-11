import React from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import './QuizControls.css';

/**
 * MEMBER 1: Quiz Controls Component
 * Controls for managing quiz flow
 */
const QuizControls = ({
  quizStatus,
  currentQuestion,
  totalQuestions,
  onStartQuiz,
  onNextQuestion,
  onEndQuiz,
  onReset,
  serverRunning
}) => {
  const isActive = quizStatus === 'active';
  const isCompleted = quizStatus === 'completed';

  return (
    <Card title="Quiz Controls">
      <div className="quiz-controls-content">
        {quizStatus !== 'inactive' && (
          <div className="quiz-progress">
            <div className="progress-info">
              <span>Question {currentQuestion} of {totalQuestions}</span>
              <span>{Math.round((currentQuestion / totalQuestions) * 100)}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="quiz-status">
          <span className={`quiz-status-badge ${quizStatus}`}>
            {quizStatus === 'active' ? '🎯 Quiz Active' :
             quizStatus === 'completed' ? '✅ Completed' :
             '⏸️ Inactive'}
          </span>
        </div>

        <div className="control-buttons">
          {quizStatus === 'inactive' && (
            <Button
              variant="primary"
              onClick={onStartQuiz}
              disabled={!serverRunning}
              className="control-btn"
            >
              🚀 Start Quiz
            </Button>
          )}

          {isActive && (
            <>
              <Button
                variant="primary"
                onClick={onNextQuestion}
                disabled={currentQuestion >= totalQuestions}
                className="control-btn"
              >
                ⏭️ Next Question
              </Button>
              <Button
                variant="danger"
                onClick={onEndQuiz}
                className="control-btn"
              >
                🏁 End Quiz
              </Button>
            </>
          )}

          {(isActive || isCompleted) && (
            <Button
              variant="warning"
              onClick={onReset}
              className="control-btn"
            >
              🔄 Reset
            </Button>
          )}
        </div>

        {!serverRunning && (
          <div className="warning-message">
            ⚠️ Server must be running to start quiz
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuizControls;
