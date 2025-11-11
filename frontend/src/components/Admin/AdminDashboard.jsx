import React, { useState, useEffect } from 'react';
import ServerStatus from './ServerStatus';
import QuizControls from './QuizControls';
import StudentListPanel from './StudentListPanel';
import './AdminDashboard.css';

/**
 * MEMBER 1: Admin Dashboard Component
 * Main control panel for quiz administration
 */
const AdminDashboard = () => {
  const [serverStatus, setServerStatus] = useState('stopped');
  const [connectedStudents, setConnectedStudents] = useState([]);
  const [quizStatus, setQuizStatus] = useState('inactive'); // inactive, active, completed
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestions] = useState(10);

  useEffect(() => {
    // Simulate real-time updates (in production, this would connect to backend)
    const interval = setInterval(() => {
      if (serverStatus === 'running') {
        // Update connected students (simulation)
        updateStudentList();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [serverStatus]);

  const updateStudentList = () => {
    // In production, fetch from backend
    const mockStudents = [
      { id: '1', name: 'Kamal Perera', status: 'Ready' },
      { id: '2', name: 'Nimal Silva', status: 'Answering' },
      { id: '3', name: 'Saman Fernando', status: 'Submitted' },
    ];
    setConnectedStudents(mockStudents);
  };

  const handleStartServer = () => {
    console.log('Starting server...');
    setServerStatus('running');
    // In production: API call to start server
  };

  const handleStopServer = () => {
    console.log('Stopping server...');
    setServerStatus('stopped');
    setQuizStatus('inactive');
    setConnectedStudents([]);
    // In production: API call to stop server
  };

  const handleStartQuiz = () => {
    if (connectedStudents.length === 0) {
      alert('No students connected!');
      return;
    }
    console.log('Starting quiz...');
    setQuizStatus('active');
    setCurrentQuestion(1);
    // In production: API call to start quiz
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      console.log(`Moving to question ${currentQuestion + 1}`);
      // In production: API call to broadcast next question
    } else {
      alert('All questions completed!');
    }
  };

  const handleEndQuiz = () => {
    console.log('Ending quiz...');
    setQuizStatus('completed');
    // In production: API call to end quiz and generate results
  };

  const handleReset = () => {
    console.log('Resetting quiz...');
    setQuizStatus('inactive');
    setCurrentQuestion(0);
    // In production: API call to reset quiz
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>📚 Admin Dashboard</h1>
        <button className="logout-btn">Logout</button>
      </div>

      <div className="dashboard-content">
        <div className="main-section">
          <ServerStatus
            status={serverStatus}
            studentsCount={connectedStudents.length}
            onStart={handleStartServer}
            onStop={handleStopServer}
          />

          <QuizControls
            quizStatus={quizStatus}
            currentQuestion={currentQuestion}
            totalQuestions={totalQuestions}
            onStartQuiz={handleStartQuiz}
            onNextQuestion={handleNextQuestion}
            onEndQuiz={handleEndQuiz}
            onReset={handleReset}
            serverRunning={serverStatus === 'running'}
          />
        </div>

        <div className="side-section">
          <StudentListPanel students={connectedStudents} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
