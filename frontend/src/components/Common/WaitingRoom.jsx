import React from 'react';
import './WaitingRoom.css';

/**
 * MEMBER 5: Waiting Room Component
 * Displayed while students wait for quiz to start
 */
const WaitingRoom = ({ studentName, connectedCount = 12 }) => {
  const participants = [
    'Kamal Perera',
    'Nimal Silva',
    'Saman Fernando',
    'Kumari Jayasinghe',
    'Sunil Bandara',
  ];

  return (
    <div className="waiting-room">
      <div className="waiting-container">
        <div className="waiting-icon">⏳</div>
        <h1>Waiting Room</h1>
        <p className="waiting-message">Quiz Starting Soon!</p>

        <div className="connected-info">
          <div className="connected-badge">
            Connected Students: <strong>{connectedCount}</strong>
          </div>
        </div>

        <div className="participants-section">
          <h3>Participants:</h3>
          <div className="participants-list">
            {participants.map((name, index) => (
              <div key={index} className="participant-item">
                <span className="participant-check">✓</span>
                <span className="participant-name">{name}</span>
              </div>
            ))}
            {connectedCount > participants.length && (
              <div className="more-participants">
                ... and {connectedCount - participants.length} more
              </div>
            )}
          </div>
        </div>

        <div className="waiting-status">
          <p>Please wait...</p>
          <div className="loading-animation">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
