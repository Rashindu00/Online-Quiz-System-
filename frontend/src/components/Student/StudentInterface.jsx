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
const StudentInterface = ({ studentName, studentId, onLogout }) => {
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
    
    // DEMO MODE: Load first question automatically after 1 second
    setTimeout(() => {
      const demoQuestion = {
        id: 1,
        text: 'What protocol does TCP use for reliable data transmission?',
        options: [
          'UDP (User Datagram Protocol)',
          'Three-way handshake with acknowledgments',
          'Broadcasting without confirmation',
          'Multicast streaming'
        ],
        correctAnswer: 1,
        timeLimit: 30
      };
      handleNewQuestion(demoQuestion);
    }, 1000);
    
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
    
    // DEMO MODE: Simulate feedback after 500ms
    setTimeout(() => {
      const isCorrect = selectedOption === currentQuestion.correctAnswer;
      const feedback = {
        correct: isCorrect,
        points: isCorrect ? 10 : 0,
        message: isCorrect ? '✅ Correct!' : '❌ Wrong answer. The correct answer was: ' + currentQuestion.options[currentQuestion.correctAnswer]
      };
      handleFeedback(feedback);
      
      // Load next question after 2 seconds
      setTimeout(() => {
        const nextQuestionNumber = questionNumber + 1;
        if (nextQuestionNumber <= totalQuestions) {
          const demoQuestions = [
            {
              id: 2,
              text: 'Which layer of the OSI model is responsible for routing?',
              options: ['Application Layer', 'Transport Layer', 'Network Layer', 'Data Link Layer'],
              correctAnswer: 2,
              timeLimit: 30
            },
            {
              id: 3,
              text: 'What is the default port number for HTTP?',
              options: ['21', '22', '80', '443'],
              correctAnswer: 2,
              timeLimit: 30
            },
            {
              id: 4,
              text: 'Which Java class is used to create a server socket?',
              options: ['Socket', 'ServerSocket', 'DatagramSocket', 'SocketChannel'],
              correctAnswer: 1,
              timeLimit: 30
            },
            {
              id: 5,
              text: 'What does NIO stand for in Java?',
              options: ['Network Input Output', 'New Input Output', 'Non-blocking IO', 'Network Interface Objects'],
              correctAnswer: 1,
              timeLimit: 30
            }
          ];
          
          const nextQuestion = demoQuestions[nextQuestionNumber - 2] || {
            id: nextQuestionNumber,
            text: `Demo Question ${nextQuestionNumber}`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
            timeLimit: 30
          };
          
          handleNewQuestion(nextQuestion);
        }
      }, 2000);
    }, 500);
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
          <p>Student: <strong>{studentName}</strong> ({studentId})</p>
        </div>
        <div className="header-actions">
          <div className="score-display">
            Score: <strong>{score}</strong> points
          </div>
          {onLogout && (
            <button className="logout-btn" onClick={onLogout}>
              🚪 Logout
            </button>
          )}
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
