import React from 'react';
import Card from '../UI/Card';
import './ScoreCard.css';

/**
 * MEMBER 4: Score Card Component
 * Displays individual student score
 */
const ScoreCard = ({ results }) => {
  const { correctAnswers, totalQuestions, totalScore, percentage, rank, totalStudents } = results;

  return (
    <Card className="score-card">
      <div className="score-card-content">
        <div className="score-main">
          <div className="score-circle">
            <svg className="progress-ring" width="180" height="180">
              <circle
                className="progress-ring-circle-bg"
                stroke="var(--border-gray)"
                strokeWidth="12"
                fill="transparent"
                r="80"
                cx="90"
                cy="90"
              />
              <circle
                className="progress-ring-circle"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="transparent"
                r="80"
                cx="90"
                cy="90"
                strokeDasharray={`${(percentage / 100) * 502.4} 502.4`}
                strokeDashoffset="0"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary-blue)" />
                  <stop offset="100%" stopColor="var(--purple)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="score-text">
              <div className="score-value">{correctAnswers}/{totalQuestions}</div>
              <div className="score-label">{percentage}%</div>
            </div>
          </div>
        </div>

        <div className="score-details">
          <div className="score-detail-item">
            <span className="detail-label">Your Score:</span>
            <span className="detail-value">{totalScore} points</span>
          </div>
          <div className="score-detail-item">
            <span className="detail-label">Correct Answers:</span>
            <span className="detail-value">{correctAnswers} / {totalQuestions}</span>
          </div>
          <div className="score-detail-item">
            <span className="detail-label">Your Rank:</span>
            <span className="detail-value rank-value">
              {rank}{rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th'} of {totalStudents}
            </span>
          </div>
        </div>

        <div className="congratulations-message">
          {percentage >= 80 ? '🎉 Excellent Work!' :
           percentage >= 60 ? '👏 Good Job!' :
           percentage >= 40 ? '👍 Well Done!' :
           '💪 Keep Practicing!'}
        </div>
      </div>
    </Card>
  );
};

export default ScoreCard;
