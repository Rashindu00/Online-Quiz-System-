import React from 'react';
import Card from '../UI/Card';
import './AnswerReview.css';

/**
 * MEMBER 4: Answer Review Component
 * Shows question-by-question review of answers
 */
const AnswerReview = ({ questions, userAnswers }) => {
  const getAnswerStatus = (questionId) => {
    const answer = userAnswers.find(a => a.questionId === questionId);
    return answer?.isCorrect || false;
  };

  const getUserAnswer = (questionId) => {
    const answer = userAnswers.find(a => a.questionId === questionId);
    return answer?.selectedOption ?? -1;
  };

  const getOptionLetter = (index) => {
    return String.fromCharCode(65 + index); // 65 is 'A'
  };

  return (
    <Card title="Answer Review" className="answer-review">
      <div className="review-list">
        {questions.map((question, index) => {
          const isCorrect = getAnswerStatus(question.id);
          const userAnswer = getUserAnswer(question.id);
          const correctAnswer = question.correctAnswerIndex;

          return (
            <div key={question.id} className={`review-item ${isCorrect ? 'correct' : 'wrong'}`}>
              <div className="review-header">
                <div className="review-question-number">
                  Question {index + 1}
                </div>
                <div className={`review-status ${isCorrect ? 'status-correct' : 'status-wrong'}`}>
                  {isCorrect ? (
                    <>
                      <span className="status-icon">✓</span>
                      <span>Correct</span>
                    </>
                  ) : (
                    <>
                      <span className="status-icon">✗</span>
                      <span>Wrong</span>
                    </>
                  )}
                </div>
              </div>

              <div className="review-question-text">
                {question.text}
              </div>

              <div className="review-answers">
                <div className="answer-row">
                  <span className="answer-label">Your Answer:</span>
                  <span className={`answer-value ${!isCorrect ? 'wrong-answer' : 'correct-answer'}`}>
                    {userAnswer >= 0 ? `${getOptionLetter(userAnswer)}) ${question.options[userAnswer]}` : 'Not answered'}
                  </span>
                </div>

                {!isCorrect && (
                  <div className="answer-row">
                    <span className="answer-label">Correct Answer:</span>
                    <span className="answer-value correct-answer">
                      {getOptionLetter(correctAnswer)}) {question.options[correctAnswer]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default AnswerReview;
