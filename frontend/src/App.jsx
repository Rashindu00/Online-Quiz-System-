import React, { useState } from 'react';
import AdminDashboard from './components/Admin/AdminDashboard';
import LoginPage from './components/Common/LoginPage';
import WaitingRoom from './components/Common/WaitingRoom';
import StudentInterface from './components/Student/StudentInterface';
import ResultsPage from './components/Results/ResultsPage';
import './styles/globals.css';

/**
 * Main Application Component
 * Handles routing between different views
 */
function App() {
  const [view, setView] = useState('login'); // login, waiting, quiz, results, admin
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');

  const handleLogin = (name, id) => {
    setStudentName(name);
    setStudentId(id);
    setView('waiting');
    
    // Simulate quiz start after 3 seconds
    setTimeout(() => {
      setView('quiz');
    }, 3000);
  };

  const handleQuizComplete = () => {
    setView('results');
  };

  // For testing different views, uncomment the desired view:
  // return <AdminDashboard />;
  // return <LoginPage onLogin={handleLogin} />;
  // return <WaitingRoom studentName={studentName} connectedCount={12} />;
  // return <StudentInterface studentName={studentName} studentId={studentId} />;
  // return <ResultsPage studentName={studentName} studentId={studentId} />;

  return (
    <div className="App">
      {view === 'login' && <LoginPage onLogin={handleLogin} />}
      {view === 'waiting' && <WaitingRoom studentName={studentName} connectedCount={12} />}
      {view === 'quiz' && <StudentInterface studentName={studentName} studentId={studentId} />}
      {view === 'results' && <ResultsPage studentName={studentName} studentId={studentId} />}
      {view === 'admin' && <AdminDashboard />}
    </div>
  );
}

export default App;
