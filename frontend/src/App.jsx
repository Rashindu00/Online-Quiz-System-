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
  const [view, setView] = useState(() => {
    // Restore session from localStorage on page refresh
    return localStorage.getItem('currentView') || 'login';
  });
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem('studentName') || '';
  });
  const [studentId, setStudentId] = useState(() => {
    return localStorage.getItem('studentId') || '';
  });

  const handleLogin = (name, id) => {
    setStudentName(name);
    setStudentId(id);
    
    // Save to localStorage
    localStorage.setItem('studentName', name);
    localStorage.setItem('studentId', id);
    localStorage.setItem('currentView', 'quiz');
    
    // Direct to quiz (skip waiting room for demo)
    setView('quiz');
    
    // OR: Show waiting room for 1 second only
    // setView('waiting');
    // setTimeout(() => {
    //   setView('quiz');
    // }, 1000);
  };

  const handleAdminLogin = () => {
    localStorage.setItem('currentView', 'admin');
    setView('admin');
  };

  const handleQuizComplete = () => {
    localStorage.setItem('currentView', 'results');
    setView('results');
  };

  const handleLogout = () => {
    // Clear localStorage and return to login
    localStorage.clear();
    setStudentName('');
    setStudentId('');
    setView('login');
  };

  // For testing different views, uncomment the desired view:
  // return <AdminDashboard />;
  // return <LoginPage onLogin={handleLogin} onAdminLogin={handleAdminLogin} />;
  // return <WaitingRoom studentName={studentName} connectedCount={12} />;
  // return <StudentInterface studentName={studentName} studentId={studentId} />;
  // return <ResultsPage studentName={studentName} studentId={studentId} />;

  return (
    <div className="App">
      {view === 'login' && <LoginPage onLogin={handleLogin} onAdminLogin={handleAdminLogin} />}
      {view === 'waiting' && <WaitingRoom studentName={studentName} connectedCount={12} />}
      {view === 'quiz' && <StudentInterface studentName={studentName} studentId={studentId} onLogout={handleLogout} />}
      {view === 'results' && <ResultsPage studentName={studentName} studentId={studentId} />}
      {view === 'admin' && <AdminDashboard onLogout={handleLogout} />}
    </div>
  );
}

export default App;
