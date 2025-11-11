import React, { useState, useEffect } from 'react';
import './ConnectionStatus.css';

/**
 * MEMBER 5: Connection Status Component
 * Shows real-time connection status with retry functionality
 */
const ConnectionStatus = ({ isConnected, onRetry }) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setRetryCount(0);
      setIsRetrying(false);
    }
  }, [isConnected]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    if (onRetry) {
      await onRetry();
    }
    
    setTimeout(() => {
      setIsRetrying(false);
    }, 2000);
  };

  return (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
      <div className="status-indicator">
        <div className={`status-dot ${isConnected ? 'dot-connected' : 'dot-disconnected'}`}></div>
        <span className="status-text">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {!isConnected && (
        <div className="connection-details">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>Connection to server lost</span>
          </div>

          {retryCount > 0 && (
            <div className="retry-info">
              Retry attempts: {retryCount}
            </div>
          )}

          <button
            className="retry-button"
            onClick={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? (
              <>
                <div className="button-spinner"></div>
                <span>Retrying...</span>
              </>
            ) : (
              <>
                <span>🔄</span>
                <span>Retry Connection</span>
              </>
            )}
          </button>

          <div className="connection-tips">
            <h4>Troubleshooting:</h4>
            <ul>
              <li>Check if the server is running</li>
              <li>Verify network connection</li>
              <li>Ensure port 8080 is not blocked</li>
            </ul>
          </div>
        </div>
      )}

      {isConnected && (
        <div className="connection-info">
          <div className="info-item">
            <span className="info-label">Server:</span>
            <span className="info-value">localhost:8080</span>
          </div>
          <div className="info-item">
            <span className="info-label">Status:</span>
            <span className="info-value success">Active</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
