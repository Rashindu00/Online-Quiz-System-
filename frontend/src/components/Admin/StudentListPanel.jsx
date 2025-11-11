import React from 'react';
import Card from '../UI/Card';
import './StudentListPanel.css';

/**
 * MEMBER 1: Student List Panel Component
 * Displays connected students in real-time
 */
const StudentListPanel = ({ students }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Ready': return '✓';
      case 'Answering': return '⏳';
      case 'Submitted': return '✓';
      default: return '○';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Ready': return 'status-ready';
      case 'Answering': return 'status-answering';
      case 'Submitted': return 'status-submitted';
      default: return 'status-default';
    }
  };

  return (
    <Card title="Connected Students">
      <div className="student-list-content">
        <div className="student-count-badge">
          {students.length} {students.length === 1 ? 'Student' : 'Students'} Connected
        </div>

        {students.length === 0 ? (
          <div className="no-students">
            <p>No students connected yet</p>
            <span className="waiting-text">Waiting for connections...</span>
          </div>
        ) : (
          <div className="student-list">
            {students.map((student) => (
              <div key={student.id} className="student-item">
                <div className="student-info">
                  <span className="student-name">{student.name}</span>
                  <span className={`student-status ${getStatusClass(student.status)}`}>
                    {getStatusIcon(student.status)} {student.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StudentListPanel;
