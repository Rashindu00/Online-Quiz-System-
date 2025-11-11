import React from 'react';
import Card from '../UI/Card';
import './Leaderboard.css';

/**
 * MEMBER 4: Leaderboard Component
 * Displays top performers
 */
const Leaderboard = ({ data, currentStudentName }) => {
  const getMedalIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  return (
    <Card title="🏆 Leaderboard" className="leaderboard-card">
      <div className="leaderboard-table">
        <div className="leaderboard-header">
          <div className="col-rank">Rank</div>
          <div className="col-name">Name</div>
          <div className="col-score">Score</div>
          <div className="col-percentage">Percentage</div>
        </div>

        <div className="leaderboard-body">
          {data.map((entry) => (
            <div
              key={entry.rank}
              className={`leaderboard-row ${
                entry.studentName === currentStudentName ? 'current-student' : ''
              } rank-${entry.rank}`}
            >
              <div className="col-rank">
                <span className="rank-number">{entry.rank}</span>
                <span className="rank-medal">{getMedalIcon(entry.rank)}</span>
              </div>
              <div className="col-name">
                {entry.studentName}
                {entry.studentName === currentStudentName && (
                  <span className="you-badge">← You</span>
                )}
              </div>
              <div className="col-score">{entry.totalScore}</div>
              <div className="col-percentage">{entry.percentage}%</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default Leaderboard;
