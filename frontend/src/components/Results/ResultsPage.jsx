import React from 'react';
import Leaderboard from './Leaderboard';
import ScoreCard from './ScoreCard';
import './ResultsPage.css';

/**
 * MEMBER 4: Results Page Component
 * Displays final quiz results and leaderboard
 */
const ResultsPage = ({ studentName, studentId, resultsData }) => {
  // Mock data for demonstration
  const studentResults = {
    studentId: studentId,
    studentName: studentName,
    totalScore: 80,
    correctAnswers: 8,
    totalQuestions: 10,
    percentage: 80,
    rank: 3,
    totalStudents: 12
  };

  const leaderboardData = [
    { rank: 1, studentName: 'Nimal Silva', totalScore: 90, percentage: 90 },
    { rank: 2, studentName: 'Kumari Perera', totalScore: 85, percentage: 85 },
    { rank: 3, studentName: studentName, totalScore: 80, percentage: 80 },
    { rank: 4, studentName: 'Saman Fernando', totalScore: 75, percentage: 75 },
    { rank: 5, studentName: 'Sunil Bandara', totalScore: 70, percentage: 70 },
  ];

  return (
    <div className="results-page">
      <div className="results-container">
        <div className="results-header">
          <h1>🏆 Quiz Results</h1>
          <p>Congratulations on completing the quiz!</p>
        </div>

        <ScoreCard results={studentResults} />

        <Leaderboard 
          data={leaderboardData} 
          currentStudentName={studentName}
        />

        <div className="results-actions">
          <button className="btn-secondary">View Answers</button>
          <button className="btn-primary">Return to Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
