import React from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import './ServerStatus.css';

/**
 * MEMBER 1: Server Status Component
 * Displays server status and controls
 */
const ServerStatus = ({ status, studentsCount, onStart, onStop }) => {
  const isRunning = status === 'running';

  return (
    <Card title="Server Status">
      <div className="server-status-content">
        <div className="status-row">
          <span className="status-label">Status:</span>
          <span className={`status-indicator ${isRunning ? 'running' : 'stopped'}`}>
            {isRunning ? '🟢 Running' : '🔴 Stopped'}
          </span>
        </div>

        <div className="status-row">
          <span className="status-label">Port:</span>
          <span className="status-value">8080</span>
        </div>

        <div className="status-row">
          <span className="status-label">Connected Students:</span>
          <span className="status-value students-count">{studentsCount}</span>
        </div>

        <div className="server-controls">
          {!isRunning ? (
            <Button variant="success" onClick={onStart}>
              ▶️ Start Server
            </Button>
          ) : (
            <Button variant="danger" onClick={onStop}>
              ⏹️ Stop Server
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ServerStatus;
