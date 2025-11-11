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
  serverRunning,
  quizzes = [],
  selectedQuizId,
  onQuizSelect
}) => {
  const isActive = quizStatus === 'active';
  const isCompleted = quizStatus === 'completed';

  // Get available quizzes (Scheduled and Active only for dropdown)
  const availableQuizzes = quizzes.filter(q => q.status === 'Scheduled' || q.status === 'Active');
  const selectedQuiz = quizzes.find(q => q.id === selectedQuizId);

  return (
    <Card title="Quiz Controls">
      <div className="quiz-controls-content">
        {/* Quiz Selector */}
        {quizStatus === 'inactive' && availableQuizzes.length > 0 && (
          <div className="quiz-selector">
            <label htmlFor="quiz-select">📋 Select Quiz to Start:</label>
            <select
              id="quiz-select"
              value={selectedQuizId || ''}
              onChange={(e) => onQuizSelect(parseInt(e.target.value))}
              className="quiz-select-dropdown"
            >
              <option value="">-- Select a Quiz --</option>
              {availableQuizzes.map(quiz => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.title} ({quiz.module}) - {quiz.questionIds.length} questions
                </option>
              ))}
            </select>
            
            {selectedQuiz && (
              <div className="selected-quiz-info">
                <p><strong>Module:</strong> {selectedQuiz.module}</p>
                <p><strong>Questions:</strong> {selectedQuiz.questionIds.length}</p>
                <p><strong>Duration:</strong> {selectedQuiz.duration} minutes</p>
                <p><strong>Total Marks:</strong> {selectedQuiz.totalMarks}</p>
              </div>
            )}
          </div>
        )}

        {quizStatus !== 'inactive' && selectedQuiz && (
          <div className="active-quiz-info">
            <h4>📋 {selectedQuiz.title}</h4>
            <p className="quiz-module-label">{selectedQuiz.module}</p>
          </div>
        )}

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
              disabled={!serverRunning || !selectedQuizId}
              className="control-btn"
            >
              🚀 Start Selected Quiz
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

        {!serverRunning && quizStatus === 'inactive' && (
          <div className="warning-message">
            ⚠️ Server must be running to start quiz
          </div>
        )}

        {!selectedQuizId && quizStatus === 'inactive' && serverRunning && (
          <div className="info-message">
            ℹ️ Please select a quiz from the dropdown above
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuizControls;
