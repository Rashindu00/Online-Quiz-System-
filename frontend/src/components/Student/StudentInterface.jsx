import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import OptionsList from './OptionsList';
import SubmitButton from './SubmitButton';
import socketService from '../../services/socketService';
import './StudentInterface.css';

/**
 * MEMBER 2: Student Quiz Interface
 * Main interface for students to take the quiz
 */
const StudentInterface = ({ studentName, studentId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions] = useState(10);

  useEffect(() => {
    // Listen for questions from server
    socketService.on('question', handleNewQuestion);
    socketService.on('feedback', handleFeedback);
    
    return () => {
      socketService.off('question', handleNewQuestion);
      socketService.off('feedback', handleFeedback);
    };
  }, []);

  const handleNewQuestion = (questionData) => {
    setCurrentQuestion(questionData);
    setSelectedOption(null);
    setFeedback(null);
    setQuestionNumber(questionData.id);
  };

  const handleFeedback = (feedbackData) => {
    setFeedback(feedbackData);
    if (feedbackData.correct) {
      setScore(score + feedbackData.points);
    }
    setIsSubmitting(false);
  };

  const handleOptionSelect = (optionIndex) => {
    if (!isSubmitting && !feedback) {
      setSelectedOption(optionIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) {
      alert('Please select an answer!');
      return;
    }

    setIsSubmitting(true);
    socketService.submitAnswer(currentQuestion.id, selectedOption);
  };

  if (!currentQuestion) {
    return (
      <div className="student-interface">
        <div className="waiting-container">
          <div className="loading-spinner"></div>
          <h2>Waiting for next question...</h2>
          <p>Please be patient</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-interface">
      <div className="student-header">
        <div className="student-info">
          <h2>📚 Network Programming Quiz</h2>
          <p>Student: <strong>{studentName}</strong></p>
        </div>
        <div className="score-display">
          Score: <strong>{score}</strong> points
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-text">
          Question {questionNumber} of {totalQuestions}
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      <QuestionCard
        questionNumber={questionNumber}
        questionText={currentQuestion.text}
        timeLimit={currentQuestion.timeLimit}
      />

      <OptionsList
        options={currentQuestion.options}
        selectedOption={selectedOption}
        onSelect={handleOptionSelect}
        disabled={isSubmitting || feedback !== null}
      />

      {feedback && (
        <div className={`feedback-message ${feedback.correct ? 'correct' : 'wrong'}`}>
          {feedback.correct ? (
            <>
              <span className="feedback-icon">✓</span>
              <span>Correct! You earned {feedback.points} points!</span>
            </>
          ) : (
            <>
              <span className="feedback-icon">✗</span>
              <span>Wrong answer. Better luck next time!</span>
            </>
          )}
        </div>
      )}

      {!feedback && (
        <SubmitButton
          onSubmit={handleSubmitAnswer}
          disabled={selectedOption === null}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default StudentInterface;
