import React, { useState } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import socketService from '../../services/socketService';
import './LoginPage.css';

/**
 * MEMBER 5: Login Page Component
 * Entry point for students to join the quiz
 */
const LoginPage = ({ onLogin }) => {
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
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

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>📚 Online Quiz System</h1>
          <p>Network Programming</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
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
