import React, { useState } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import socketService from '../../services/socketService';
import './LoginPage.css';

/**
 * MEMBER 5: Login Page Component
 * Entry point for students and admin to join the quiz
 */
const LoginPage = ({ onLogin, onAdminLogin }) => {
  const [userType, setUserType] = useState('student'); // 'student' or 'admin'
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    
    // Admin credentials: username=admin, password=admin123
    if (adminPassword === 'admin123') {
      setError('');
      if (onAdminLogin) {
        onAdminLogin();
      }
    } else {
      setError('Invalid admin password');
    }
  };

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    
    if (!studentName.trim() || !studentId.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      // Connect to server
      const connected = await socketService.connect();
      
      if (connected) {
        // Register student
        socketService.register(studentName, studentId);
        
        // Wait for registration confirmation
        socketService.on('registered', (data) => {
          if (data.success) {
            onLogin(studentName, studentId);
          } else {
            setError('Registration failed');
            setIsConnecting(false);
          }
        });
      } else {
        setError('Cannot connect to server');
        setIsConnecting(false);
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
      setIsConnecting(false);
    }
  };

  const handleSubmit = (e) => {
    if (userType === 'admin') {
      handleAdminLogin(e);
    } else {
      handleStudentLogin(e);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>📚 Online Quiz System</h1>
          <p>Network Programming</p>
        </div>

        {/* User Type Selection */}
        <div className="user-type-selector">
          <button
            type="button"
            className={`type-btn ${userType === 'student' ? 'active' : ''}`}
            onClick={() => {
              setUserType('student');
              setError('');
            }}
          >
            👨‍🎓 Student
          </button>
          <button
            type="button"
            className={`type-btn ${userType === 'admin' ? 'active' : ''}`}
            onClick={() => {
              setUserType('admin');
              setError('');
            }}
          >
            👨‍💼 Admin
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {userType === 'student' ? (
            <>
              <Input
                label="Student Name"
                type="text"
                placeholder="Enter your full name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                error={error && !studentName ? 'Name is required' : ''}
              />

              <Input
                label="Student ID"
                type="text"
                placeholder="Enter your student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                error={error && !studentId ? 'Student ID is required' : ''}
              />
            </>
          ) : (
            <>
              <div className="admin-info">
                <p>🔐 Admin Login</p>
                <small>Default password: <code>admin123</code></small>
              </div>
              <Input
                label="Admin Password"
                type="password"
                placeholder="Enter admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                error={error ? error : ''}
              />
            </>
          )}

          {error && <div className="error-message">{error}</div>}

          <Button
            variant="primary"
            type="submit"
            disabled={isConnecting}
            className="login-btn"
          >
            {isConnecting ? (
              <>
                <div className="button-spinner"></div>
                Connecting...
              </>
            ) : userType === 'admin' ? (
              '🔑 Login as Admin'
            ) : (
              '🚀 Join Quiz'
            )}
          </Button>
        </form>

        <div className="server-status">
          <span className="status-dot"></span>
          Server Available
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
