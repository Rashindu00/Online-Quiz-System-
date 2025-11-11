import React, { useState, useEffect } from 'react';
import ServerStatus from './ServerStatus';
import QuizControls from './QuizControls';
import StudentListPanel from './StudentListPanel';
import QuestionPanel from './QuestionPanel';
import './AdminDashboard.css';

/**
 * MEMBER 1: Admin Dashboard Component
 * Main control panel for quiz administration
 */
const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, questions, users, results, quizzes
  const [serverStatus, setServerStatus] = useState('stopped');
  const [connectedStudents, setConnectedStudents] = useState([]);
  const [quizStatus, setQuizStatus] = useState('inactive'); // inactive, active, completed
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [selectedQuizId, setSelectedQuizId] = useState(null); // Selected quiz for Dashboard controls
  
  // Quiz Management State
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: 'Network Programming Basics',
      module: 'Network Programming',
      description: 'Basic concepts of network programming including sockets and protocols',
      questionIds: [1, 2, 3, 4, 5],
      duration: 30,
      scheduledDate: '2025-11-15',
      scheduledTime: '10:00 AM',
      status: 'Scheduled',
      createdDate: '2025-11-01',
      totalMarks: 50,
      passingMarks: 25
    },
    {
      id: 2,
      title: 'Advanced Java NIO',
      module: 'Java Programming',
      description: 'Non-blocking I/O operations and channel buffers',
      questionIds: [6, 7, 8, 9, 10],
      duration: 45,
      scheduledDate: '2025-11-20',
      scheduledTime: '02:00 PM',
      status: 'Scheduled',
      createdDate: '2025-11-05',
      totalMarks: 50,
      passingMarks: 30
    },
    {
      id: 3,
      title: 'TCP/UDP Protocols Quiz',
      module: 'Network Programming',
      description: 'Understanding TCP and UDP communication protocols',
      questionIds: [1, 3, 6],
      duration: 20,
      scheduledDate: '2025-11-12',
      scheduledTime: '09:00 AM',
      status: 'Active',
      createdDate: '2025-11-10',
      totalMarks: 30,
      passingMarks: 15
    },
    {
      id: 4,
      title: 'Multithreading Concepts',
      module: 'Java Programming',
      description: 'Thread synchronization and concurrent programming',
      questionIds: [4, 5, 7, 8],
      duration: 25,
      scheduledDate: '2025-11-08',
      scheduledTime: '11:00 AM',
      status: 'Completed',
      createdDate: '2025-11-01',
      totalMarks: 40,
      passingMarks: 20
    }
  ]);
  const [isCreateQuizModalOpen, setIsCreateQuizModalOpen] = useState(false);
  const [isEditQuizModalOpen, setIsEditQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    module: '',
    description: '',
    questionIds: [],
    duration: 30,
    scheduledDate: '',
    scheduledTime: '',
    totalMarks: 50,
    passingMarks: 25
  });
  
  const [registeredUsers] = useState([
    { 
      id: '001', 
      name: 'Kamal Perera', 
      email: 'kamal@example.com',
      studentId: 'CS/2020/001',
      registeredDate: '2025-01-15',
      lastLogin: '2025-11-12 10:30 AM',
      status: 'Active',
      quizzesCompleted: 5,
      averageScore: 85
    },
    { 
      id: '002', 
      name: 'Nimal Silva', 
      email: 'nimal@example.com',
      studentId: 'CS/2020/002',
      registeredDate: '2025-01-18',
      lastLogin: '2025-11-11 03:45 PM',
      status: 'Active',
      quizzesCompleted: 3,
      averageScore: 70
    },
    { 
      id: '003', 
      name: 'Saman Fernando', 
      email: 'saman@example.com',
      studentId: 'CS/2020/003',
      registeredDate: '2025-02-01',
      lastLogin: '2025-11-12 09:15 AM',
      status: 'Active',
      quizzesCompleted: 7,
      averageScore: 95
    },
    { 
      id: '004', 
      name: 'Kumari Jayasinghe', 
      email: 'kumari@example.com',
      studentId: 'CS/2020/004',
      registeredDate: '2025-01-20',
      lastLogin: '2025-11-10 02:20 PM',
      status: 'Active',
      quizzesCompleted: 4,
      averageScore: 60
    },
    { 
      id: '005', 
      name: 'Sunil Bandara', 
      email: 'sunil@example.com',
      studentId: 'CS/2020/005',
      registeredDate: '2025-01-25',
      lastLogin: '2025-11-09 11:00 AM',
      status: 'Inactive',
      quizzesCompleted: 2,
      averageScore: 75
    },
    { 
      id: '006', 
      name: 'Priya Wickramasinghe', 
      email: 'priya@example.com',
      studentId: 'CS/2020/006',
      registeredDate: '2025-02-05',
      lastLogin: '2025-11-12 08:45 AM',
      status: 'Active',
      quizzesCompleted: 6,
      averageScore: 88
    },
  ]);
  const [studentResults] = useState([
    { id: '001', name: 'Kamal Perera', score: 85, totalQuestions: 10, correctAnswers: 9, grade: 'A' },
    { id: '002', name: 'Nimal Silva', score: 70, totalQuestions: 10, correctAnswers: 7, grade: 'B' },
    { id: '003', name: 'Saman Fernando', score: 95, totalQuestions: 10, correctAnswers: 10, grade: 'A+' },
    { id: '004', name: 'Kumari Jayasinghe', score: 60, totalQuestions: 10, correctAnswers: 6, grade: 'C' },
    { id: '005', name: 'Sunil Bandara', score: 75, totalQuestions: 10, correctAnswers: 8, grade: 'B+' },
  ]);
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: 'What protocol does TCP use for reliable data transmission?',
      options: ['UDP', 'Three-way handshake', 'Broadcasting', 'Multicast'],
      timeLimit: 30
    },
    {
      id: 2,
      text: 'Which layer of the OSI model is responsible for routing?',
      options: ['Application', 'Transport', 'Network', 'Data Link'],
      timeLimit: 30
    },
    {
      id: 3,
      text: 'What is the default port number for HTTP?',
      options: ['21', '22', '80', '443'],
      timeLimit: 30
    },
    {
      id: 4,
      text: 'Which Java class is used to create a server socket?',
      options: ['Socket', 'ServerSocket', 'DatagramSocket', 'SocketChannel'],
      timeLimit: 30
    },
    {
      id: 5,
      text: 'What does NIO stand for in Java?',
      options: ['Network Input Output', 'New Input Output', 'Non-blocking IO', 'Network Interface Objects'],
      timeLimit: 30
    },
    {
      id: 6,
      text: 'Which protocol is connectionless?',
      options: ['TCP', 'UDP', 'HTTP', 'FTP'],
      timeLimit: 30
    },
    {
      id: 7,
      text: 'What is the maximum size of a TCP packet?',
      options: ['64 KB', '128 KB', '256 KB', '512 KB'],
      timeLimit: 30
    },
    {
      id: 8,
      text: 'Which method is used to accept client connections?',
      options: ['connect()', 'accept()', 'listen()', 'bind()'],
      timeLimit: 30
    },
    {
      id: 9,
      text: 'What is the purpose of the bind() method?',
      options: ['Connect to server', 'Associate socket with port', 'Send data', 'Receive data'],
      timeLimit: 30
    },
    {
      id: 10,
      text: 'Which of the following is a thread-safe collection?',
      options: ['ArrayList', 'HashMap', 'ConcurrentHashMap', 'LinkedList'],
      timeLimit: 30
    }
  ]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    timeLimit: 30
  });

  useEffect(() => {
    setTotalQuestions(questions.length);
  }, [questions]);

  useEffect(() => {
    // Simulate real-time updates (in production, this would connect to backend)
    const interval = setInterval(() => {
      if (serverStatus === 'running') {
        // Update connected students (simulation)
        updateStudentList();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [serverStatus]);

  const updateStudentList = () => {
    // In production, fetch from backend
    const mockStudents = [
      { id: '1', name: 'Kamal Perera', status: 'Ready' },
      { id: '2', name: 'Nimal Silva', status: 'Answering' },
      { id: '3', name: 'Saman Fernando', status: 'Submitted' },
    ];
    setConnectedStudents(mockStudents);
  };

  const handleStartServer = () => {
    console.log('Starting server...');
    setServerStatus('running');
    // In production: API call to start server
  };

  const handleStopServer = () => {
    console.log('Stopping server...');
    setServerStatus('stopped');
    setQuizStatus('inactive');
    setConnectedStudents([]);
    // In production: API call to stop server
  };

  const handleStartQuiz = () => {
    if (serverStatus !== 'running') {
      alert('Server must be running to start quiz!');
      return;
    }
    if (!selectedQuizId) {
      alert('Please select a quiz from the dropdown!');
      return;
    }
    if (connectedStudents.length === 0) {
      alert('No students connected! Please wait for students to join.');
      return;
    }

    const selectedQuiz = quizzes.find(q => q.id === selectedQuizId);
    if (!selectedQuiz) {
      alert('Selected quiz not found!');
      return;
    }

    console.log(`Starting quiz: ${selectedQuiz.title}...`);
    
    // Update quiz status to Active
    const updatedQuizzes = quizzes.map(q => 
      q.id === selectedQuizId ? { ...q, status: 'Active' } : q
    );
    setQuizzes(updatedQuizzes);
    
    setQuizStatus('active');
    setCurrentQuestion(1);
    setTotalQuestions(selectedQuiz.questionIds.length);
    
    console.log(`Quiz "${selectedQuiz.title}" started with ${selectedQuiz.questionIds.length} questions`);
    // In production: API call to start quiz and broadcast to students
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      console.log(`Moving to question ${currentQuestion + 1}`);
      // In production: API call to broadcast next question
    } else {
      alert('All questions completed!');
    }
  };

  const handleEndQuiz = () => {
    console.log('Ending quiz...');
    
    // Update the quiz status to Completed in quiz management
    if (selectedQuizId) {
      const updatedQuizzes = quizzes.map(q => 
        q.id === selectedQuizId ? { ...q, status: 'Completed' } : q
      );
      setQuizzes(updatedQuizzes);
    }
    
    setQuizStatus('completed');
    // In production: API call to end quiz and generate results
  };

  const handleReset = () => {
    console.log('Resetting quiz...');
    setQuizStatus('inactive');
    setCurrentQuestion(0);
    // In production: API call to reset quiz
  };

  const handleBroadcastQuestion = (questionIndex) => {
    console.log(`Broadcasting question ${questionIndex + 1}...`);
    setCurrentQuestion(questionIndex + 1);
  };

  const handleSkipQuestion = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      console.log(`Skipping to question ${currentQuestion + 1}`);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      if (onLogout) {
        onLogout();
      }
    }
  };

  // Question CRUD Operations
  const handleAddQuestion = () => {
    if (!newQuestion.text || newQuestion.options.some(opt => !opt)) {
      alert('Please fill all fields!');
      return;
    }
    
    const questionToAdd = {
      id: questions.length + 1,
      ...newQuestion
    };
    
    setQuestions([...questions, questionToAdd]);
    setIsAddModalOpen(false);
    setNewQuestion({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      timeLimit: 30
    });
    alert('Question added successfully!');
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion({ ...question });
    setIsEditModalOpen(true);
  };

  const handleUpdateQuestion = () => {
    if (!editingQuestion.text || editingQuestion.options.some(opt => !opt)) {
      alert('Please fill all fields!');
      return;
    }
    
    setQuestions(questions.map(q => 
      q.id === editingQuestion.id ? editingQuestion : q
    ));
    setIsEditModalOpen(false);
    setEditingQuestion(null);
    alert('Question updated successfully!');
  };

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q.id !== questionId));
      // Reorder IDs
      const reorderedQuestions = questions
        .filter(q => q.id !== questionId)
        .map((q, index) => ({ ...q, id: index + 1 }));
      setQuestions(reorderedQuestions);
      alert('Question deleted successfully!');
    }
  };

  // Quiz Management Functions
  const handleCreateQuiz = () => {
    if (!newQuiz.title || !newQuiz.module || !newQuiz.scheduledDate || !newQuiz.scheduledTime) {
      alert('Please fill all required fields!');
      return;
    }
    
    if (newQuiz.questionIds.length === 0) {
      alert('Please select at least one question!');
      return;
    }

    const quizToAdd = {
      id: quizzes.length + 1,
      ...newQuiz,
      status: 'Scheduled',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setQuizzes([...quizzes, quizToAdd]);
    setIsCreateQuizModalOpen(false);
    setNewQuiz({
      title: '',
      module: '',
      description: '',
      questionIds: [],
      duration: 30,
      scheduledDate: '',
      scheduledTime: '',
      totalMarks: 50,
      passingMarks: 25
    });
    alert('Quiz created successfully!');
  };

  const handleStartQuizNow = (quizId) => {
    if (window.confirm('Do you want to start this quiz now?')) {
      setQuizzes(quizzes.map(q => 
        q.id === quizId ? { ...q, status: 'Active' } : q
      ));
      alert('Quiz started successfully! Students can now join.');
    }
  };

  const handleStopQuiz = (quizId) => {
    if (window.confirm('Do you want to stop this quiz?')) {
      setQuizzes(quizzes.map(q => 
        q.id === quizId ? { ...q, status: 'Completed' } : q
      ));
      alert('Quiz stopped successfully!');
    }
  };

  const handleDeleteQuiz = (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(quizzes.filter(q => q.id !== quizId));
      alert('Quiz deleted successfully!');
    }
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuiz({ ...quiz });
    setIsEditQuizModalOpen(true);
  };

  const handleUpdateQuiz = () => {
    if (!editingQuiz.title || !editingQuiz.module || !editingQuiz.scheduledDate || !editingQuiz.scheduledTime) {
      alert('Please fill all required fields!');
      return;
    }

    if (editingQuiz.questionIds.length === 0) {
      alert('Please select at least one question!');
      return;
    }

    const updatedQuizzes = quizzes.map(q => 
      q.id === editingQuiz.id ? { ...editingQuiz } : q
    );
    setQuizzes(updatedQuizzes);
    setIsEditQuizModalOpen(false);
    setEditingQuiz(null);
    alert('Quiz updated successfully!');
  };

  const toggleQuestionSelection = (questionId) => {
    if (newQuiz.questionIds.includes(questionId)) {
      setNewQuiz({
        ...newQuiz,
        questionIds: newQuiz.questionIds.filter(id => id !== questionId)
      });
    } else {
      setNewQuiz({
        ...newQuiz,
        questionIds: [...newQuiz.questionIds, questionId]
      });
    }
  };

  const toggleQuestionSelectionForEdit = (questionId) => {
    if (editingQuiz.questionIds.includes(questionId)) {
      setEditingQuiz({
        ...editingQuiz,
        questionIds: editingQuiz.questionIds.filter(id => id !== questionId)
      });
    } else {
      setEditingQuiz({
        ...editingQuiz,
        questionIds: [...editingQuiz.questionIds, questionId]
      });
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-left">
          <h1>📚 Quiz Admin Panel</h1>
          <span className="admin-badge">Administrator</span>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-nav">
        <button
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="nav-icon">🏠</span>
          Dashboard
        </button>
        <button
          className={`nav-tab ${activeTab === 'quizzes' ? 'active' : ''}`}
          onClick={() => setActiveTab('quizzes')}
        >
          <span className="nav-icon">📋</span>
          Quiz Management
        </button>
        <button
          className={`nav-tab ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          <span className="nav-icon">📝</span>
          Question Bank
        </button>
        <button
          className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <span className="nav-icon">👥</span>
          Registered Users
        </button>
        <button
          className={`nav-tab ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          <span className="nav-icon">📊</span>
          Quiz Results
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="dashboard-content">
          <div className="left-section">
            <ServerStatus
              status={serverStatus}
              studentsCount={connectedStudents.length}
              onStart={handleStartServer}
              onStop={handleStopServer}
            />

            <QuizControls
              quizStatus={quizStatus}
              currentQuestion={currentQuestion}
              totalQuestions={totalQuestions}
              onStartQuiz={handleStartQuiz}
              onNextQuestion={handleNextQuestion}
              onEndQuiz={handleEndQuiz}
              onReset={handleReset}
              serverRunning={serverStatus === 'running'}
              quizzes={quizzes}
              selectedQuizId={selectedQuizId}
              onQuizSelect={setSelectedQuizId}
            />
          </div>

          <div className="right-section">
            <StudentListPanel students={connectedStudents} />
          </div>
        </div>
      )}

      {/* Quiz Management Tab */}
      {activeTab === 'quizzes' && (
        <div className="dashboard-content single-column">
          <div className="quiz-management-container">
            <div className="quiz-management-header">
              <h2>📋 Quiz Management System</h2>
              <button className="create-quiz-btn" onClick={() => setIsCreateQuizModalOpen(true)}>
                ➕ Create New Quiz
              </button>
            </div>

            <div className="quiz-stats-row">
              <div className="quiz-stat-card">
                <span className="stat-icon">📊</span>
                <div className="stat-content">
                  <span className="stat-value">{quizzes.length}</span>
                  <span className="stat-label">Total Quizzes</span>
                </div>
              </div>
              <div className="quiz-stat-card">
                <span className="stat-icon">🟢</span>
                <div className="stat-content">
                  <span className="stat-value">{quizzes.filter(q => q.status === 'Active').length}</span>
                  <span className="stat-label">Active Quizzes</span>
                </div>
              </div>
              <div className="quiz-stat-card">
                <span className="stat-icon">⏰</span>
                <div className="stat-content">
                  <span className="stat-value">{quizzes.filter(q => q.status === 'Scheduled').length}</span>
                  <span className="stat-label">Scheduled</span>
                </div>
              </div>
              <div className="quiz-stat-card">
                <span className="stat-icon">✅</span>
                <div className="stat-content">
                  <span className="stat-value">{quizzes.filter(q => q.status === 'Completed').length}</span>
                  <span className="stat-label">Completed</span>
                </div>
              </div>
            </div>

            <div className="quizzes-grid">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className={`quiz-card quiz-${quiz.status.toLowerCase()}`}>
                  <div className="quiz-card-header">
                    <div className="quiz-title-section">
                      <h3>{quiz.title}</h3>
                      <span className="quiz-module-badge">{quiz.module}</span>
                    </div>
                    <span className={`quiz-status-badge status-${quiz.status.toLowerCase()}`}>
                      {quiz.status === 'Active' && '🟢 '}
                      {quiz.status === 'Scheduled' && '⏰ '}
                      {quiz.status === 'Completed' && '✅ '}
                      {quiz.status}
                    </span>
                  </div>

                  <div className="quiz-card-body">
                    <p className="quiz-description">{quiz.description}</p>
                    
                    <div className="quiz-details-grid">
                      <div className="quiz-detail-item">
                        <span className="detail-icon">📝</span>
                        <span className="detail-text">{quiz.questionIds.length} Questions</span>
                      </div>
                      <div className="quiz-detail-item">
                        <span className="detail-icon">⏱️</span>
                        <span className="detail-text">{quiz.duration} minutes</span>
                      </div>
                      <div className="quiz-detail-item">
                        <span className="detail-icon">📅</span>
                        <span className="detail-text">{quiz.scheduledDate}</span>
                      </div>
                      <div className="quiz-detail-item">
                        <span className="detail-icon">🕐</span>
                        <span className="detail-text">{quiz.scheduledTime}</span>
                      </div>
                      <div className="quiz-detail-item">
                        <span className="detail-icon">💯</span>
                        <span className="detail-text">Total: {quiz.totalMarks} marks</span>
                      </div>
                      <div className="quiz-detail-item">
                        <span className="detail-icon">✓</span>
                        <span className="detail-text">Pass: {quiz.passingMarks} marks</span>
                      </div>
                    </div>
                  </div>

                  <div className="quiz-card-footer">
                    <div className="quiz-primary-actions">
                      {quiz.status === 'Scheduled' && (
                        <button className="quiz-action-btn start-btn" onClick={() => handleStartQuizNow(quiz.id)}>
                          ▶️ Start Now
                        </button>
                      )}
                      {quiz.status === 'Active' && (
                        <button className="quiz-action-btn stop-btn" onClick={() => handleStopQuiz(quiz.id)}>
                          ⏸️ Stop Quiz
                        </button>
                      )}
                      {quiz.status === 'Completed' && (
                        <button className="quiz-action-btn view-btn">
                          📊 View Results
                        </button>
                      )}
                    </div>
                    <div className="quiz-secondary-actions">
                      <button className="action-btn edit-btn" onClick={() => handleEditQuiz(quiz)}>
                        ✏️ Edit
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDeleteQuiz(quiz.id)}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Question Bank Tab */}
      {activeTab === 'questions' && (
        <div className="dashboard-content single-column">
          <div className="question-bank-container">
            <div className="question-bank-header">
              <h2>📝 Question Bank Management</h2>
              <button className="add-question-btn" onClick={() => setIsAddModalOpen(true)}>
                ➕ Add New Question
              </button>
            </div>

            <div className="questions-list">
              {questions.map((question, index) => (
                <div key={question.id} className="question-item-card">
                  <div className="question-item-header">
                    <span className="question-number">Question {question.id}</span>
                    <div className="question-actions">
                      <button className="action-btn edit-btn" onClick={() => handleEditQuestion(question)}>
                        ✏️ Edit
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDeleteQuestion(question.id)}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                  <div className="question-item-content">
                    <p className="question-text">{question.text}</p>
                    <div className="question-options">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className={`option-item ${optIndex === question.correctAnswer ? 'correct-option' : ''}`}>
                          <span className="option-label">{String.fromCharCode(65 + optIndex)})</span>
                          <span className="option-text">{option}</span>
                          {optIndex === question.correctAnswer && <span className="correct-badge">✓ Correct</span>}
                        </div>
                      ))}
                    </div>
                    <div className="question-meta">
                      <span className="meta-item">⏱️ {question.timeLimit}s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Registered Users Tab */}
      {activeTab === 'users' && (
        <div className="dashboard-content single-column">
          <div className="users-container">
            <div className="users-header">
              <h2>👥 Registered Users Management</h2>
              <div className="users-stats">
                <div className="stat-card">
                  <span className="stat-label">Total Users</span>
                  <span className="stat-value">{registeredUsers.length}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Active Users</span>
                  <span className="stat-value">
                    {registeredUsers.filter(u => u.status === 'Active').length}
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Inactive Users</span>
                  <span className="stat-value">
                    {registeredUsers.filter(u => u.status === 'Inactive').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Registered Date</th>
                    <th>Last Login</th>
                    <th>Quizzes</th>
                    <th>Avg Score</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registeredUsers.map((user, index) => (
                    <tr key={user.id} className={user.status === 'Inactive' ? 'inactive-row' : ''}>
                      <td>{index + 1}</td>
                      <td className="student-id">{user.studentId}</td>
                      <td className="user-name">
                        <div className="user-avatar">{user.name.charAt(0)}</div>
                        {user.name}
                      </td>
                      <td className="user-email">{user.email}</td>
                      <td>{user.registeredDate}</td>
                      <td>{user.lastLogin}</td>
                      <td>
                        <span className="quiz-count-badge">{user.quizzesCompleted}</span>
                      </td>
                      <td>
                        <div className="score-cell">
                          <span className="score-value">{user.averageScore}%</span>
                          <div className="score-bar-mini">
                            <div className="score-fill-mini" style={{ width: `${user.averageScore}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`user-status-badge ${user.status.toLowerCase()}`}>
                          {user.status === 'Active' ? '🟢' : '🔴'} {user.status}
                        </span>
                      </td>
                      <td>
                        <div className="user-actions">
                          <button className="action-btn-small view-btn" title="View Details">
                            👁️
                          </button>
                          <button className="action-btn-small edit-btn" title="Edit User">
                            ✏️
                          </button>
                          <button className="action-btn-small delete-btn" title="Delete User">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="users-summary">
              <div className="summary-card">
                <h3>📈 User Statistics</h3>
                <div className="summary-stats">
                  <div className="summary-item">
                    <span className="summary-label">Most Active User:</span>
                    <span className="summary-value">
                      {registeredUsers.sort((a, b) => b.quizzesCompleted - a.quizzesCompleted)[0]?.name}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Top Performer:</span>
                    <span className="summary-value">
                      {registeredUsers.sort((a, b) => b.averageScore - a.averageScore)[0]?.name}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Recent Registration:</span>
                    <span className="summary-value">
                      {registeredUsers.sort((a, b) => new Date(b.registeredDate) - new Date(a.registeredDate))[0]?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Results Tab */}
      {activeTab === 'results' && (
        <div className="dashboard-content single-column">
          <div className="results-container">
            <div className="results-header">
              <h2>📊 Student Results & Rankings</h2>
              <div className="results-stats">
                <div className="stat-card">
                  <span className="stat-label">Total Students</span>
                  <span className="stat-value">{studentResults.length}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Average Score</span>
                  <span className="stat-value">
                    {Math.round(studentResults.reduce((sum, s) => sum + s.score, 0) / studentResults.length)}%
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Highest Score</span>
                  <span className="stat-value">{Math.max(...studentResults.map(s => s.score))}%</span>
                </div>
              </div>
            </div>

            <div className="results-table">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Correct Answers</th>
                    <th>Grade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentResults
                    .sort((a, b) => b.score - a.score)
                    .map((student, index) => (
                      <tr key={student.id} className={index < 3 ? 'top-rank' : ''}>
                        <td>
                          <span className={`rank-badge rank-${index + 1}`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </span>
                        </td>
                        <td>{student.id}</td>
                        <td className="student-name">{student.name}</td>
                        <td>
                          <div className="score-cell">
                            <span className="score-value">{student.score}%</span>
                            <div className="score-bar">
                              <div className="score-fill" style={{ width: `${student.score}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td>{student.correctAnswers}/{student.totalQuestions}</td>
                        <td>
                          <span className={`grade-badge grade-${student.grade.replace('+', 'plus')}`}>
                            {student.grade}
                          </span>
                        </td>
                        <td>
                          <span className="status-badge status-completed">✓ Completed</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>➕ Add New Question</h3>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Question Text:</label>
                <textarea
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                  placeholder="Enter your question here..."
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Options:</label>
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="option-input-group">
                    <span className="option-label">{String.fromCharCode(65 + index)})</span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newQuestion.options];
                        newOptions[index] = e.target.value;
                        setNewQuestion({...newQuestion, options: newOptions});
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    />
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Correct Answer:</label>
                <select
                  value={newQuestion.correctAnswer}
                  onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: parseInt(e.target.value)})}
                >
                  {newQuestion.options.map((_, index) => (
                    <option key={index} value={index}>
                      Option {String.fromCharCode(65 + index)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Time Limit (seconds):</label>
                <input
                  type="number"
                  value={newQuestion.timeLimit}
                  onChange={(e) => setNewQuestion({...newQuestion, timeLimit: parseInt(e.target.value)})}
                  min="10"
                  max="120"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={handleAddQuestion}>Add Question</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {isEditModalOpen && editingQuestion && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✏️ Edit Question {editingQuestion.id}</h3>
              <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Question Text:</label>
                <textarea
                  value={editingQuestion.text}
                  onChange={(e) => setEditingQuestion({...editingQuestion, text: e.target.value})}
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Options:</label>
                {editingQuestion.options.map((option, index) => (
                  <div key={index} className="option-input-group">
                    <span className="option-label">{String.fromCharCode(65 + index)})</span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...editingQuestion.options];
                        newOptions[index] = e.target.value;
                        setEditingQuestion({...editingQuestion, options: newOptions});
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Correct Answer:</label>
                <select
                  value={editingQuestion.correctAnswer}
                  onChange={(e) => setEditingQuestion({...editingQuestion, correctAnswer: parseInt(e.target.value)})}
                >
                  {editingQuestion.options.map((_, index) => (
                    <option key={index} value={index}>
                      Option {String.fromCharCode(65 + index)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Time Limit (seconds):</label>
                <input
                  type="number"
                  value={editingQuestion.timeLimit}
                  onChange={(e) => setEditingQuestion({...editingQuestion, timeLimit: parseInt(e.target.value)})}
                  min="10"
                  max="120"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={handleUpdateQuestion}>Update Question</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Quiz Modal */}
      {isCreateQuizModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateQuizModalOpen(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>➕ Create New Quiz</h3>
              <button className="modal-close" onClick={() => setIsCreateQuizModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Quiz Title: *</label>
                <input
                  type="text"
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
                  placeholder="Enter quiz title..."
                />
              </div>

              <div className="form-group">
                <label>Module: *</label>
                <input
                  type="text"
                  value={newQuiz.module}
                  onChange={(e) => setNewQuiz({...newQuiz, module: e.target.value})}
                  placeholder="e.g., Network Programming, Java Programming..."
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={newQuiz.description}
                  onChange={(e) => setNewQuiz({...newQuiz, description: e.target.value})}
                  rows="3"
                  placeholder="Enter quiz description..."
                />
              </div>

              <div className="form-group">
                <label>Select Questions: * (Select at least one)</label>
                <div className="question-selection-list">
                  {questions.map((question) => (
                    <div key={question.id} className="question-checkbox-item">
                      <input
                        type="checkbox"
                        id={`quiz-q-${question.id}`}
                        checked={newQuiz.questionIds.includes(question.id)}
                        onChange={() => toggleQuestionSelection(question.id)}
                      />
                      <label htmlFor={`quiz-q-${question.id}`}>
                        <span className="question-id">Q{question.id}</span>
                        <span className="question-text">{question.text}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration (minutes): *</label>
                  <input
                    type="number"
                    value={newQuiz.duration}
                    onChange={(e) => setNewQuiz({...newQuiz, duration: parseInt(e.target.value) || 0})}
                    min="5"
                    max="180"
                    placeholder="30"
                  />
                </div>

                <div className="form-group">
                  <label>Total Marks:</label>
                  <input
                    type="number"
                    value={newQuiz.totalMarks}
                    onChange={(e) => setNewQuiz({...newQuiz, totalMarks: parseInt(e.target.value) || 0})}
                    min="0"
                    placeholder="50"
                  />
                </div>

                <div className="form-group">
                  <label>Passing Marks:</label>
                  <input
                    type="number"
                    value={newQuiz.passingMarks}
                    onChange={(e) => setNewQuiz({...newQuiz, passingMarks: parseInt(e.target.value) || 0})}
                    min="0"
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Scheduled Date: *</label>
                  <input
                    type="date"
                    value={newQuiz.scheduledDate}
                    onChange={(e) => setNewQuiz({...newQuiz, scheduledDate: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Scheduled Time: *</label>
                  <input
                    type="time"
                    value={newQuiz.scheduledTime}
                    onChange={(e) => setNewQuiz({...newQuiz, scheduledTime: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-info">
                <p>📝 Selected Questions: <strong>{newQuiz.questionIds.length}</strong></p>
                <p>⏱️ Estimated Duration: <strong>{newQuiz.duration} minutes</strong></p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsCreateQuizModalOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={handleCreateQuiz}>Create Quiz</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Quiz Modal */}
      {isEditQuizModalOpen && editingQuiz && (
        <div className="modal-overlay" onClick={() => setIsEditQuizModalOpen(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✏️ Edit Quiz - {editingQuiz.title}</h3>
              <button className="modal-close" onClick={() => setIsEditQuizModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Quiz Title: *</label>
                <input
                  type="text"
                  value={editingQuiz.title}
                  onChange={(e) => setEditingQuiz({...editingQuiz, title: e.target.value})}
                  placeholder="Enter quiz title..."
                />
              </div>

              <div className="form-group">
                <label>Module: *</label>
                <input
                  type="text"
                  value={editingQuiz.module}
                  onChange={(e) => setEditingQuiz({...editingQuiz, module: e.target.value})}
                  placeholder="e.g., Network Programming, Java Programming..."
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={editingQuiz.description}
                  onChange={(e) => setEditingQuiz({...editingQuiz, description: e.target.value})}
                  rows="3"
                  placeholder="Enter quiz description..."
                />
              </div>

              <div className="form-group">
                <label>Select Questions: * (Select at least one)</label>
                <div className="question-selection-list">
                  {questions.map((question) => (
                    <div key={question.id} className="question-checkbox-item">
                      <input
                        type="checkbox"
                        id={`edit-quiz-q-${question.id}`}
                        checked={editingQuiz.questionIds.includes(question.id)}
                        onChange={() => toggleQuestionSelectionForEdit(question.id)}
                      />
                      <label htmlFor={`edit-quiz-q-${question.id}`}>
                        <span className="question-id">Q{question.id}</span>
                        <span className="question-text">{question.text}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration (minutes): *</label>
                  <input
                    type="number"
                    value={editingQuiz.duration}
                    onChange={(e) => setEditingQuiz({...editingQuiz, duration: parseInt(e.target.value) || 0})}
                    min="5"
                    max="180"
                    placeholder="30"
                  />
                </div>

                <div className="form-group">
                  <label>Total Marks:</label>
                  <input
                    type="number"
                    value={editingQuiz.totalMarks}
                    onChange={(e) => setEditingQuiz({...editingQuiz, totalMarks: parseInt(e.target.value) || 0})}
                    min="0"
                    placeholder="50"
                  />
                </div>

                <div className="form-group">
                  <label>Passing Marks:</label>
                  <input
                    type="number"
                    value={editingQuiz.passingMarks}
                    onChange={(e) => setEditingQuiz({...editingQuiz, passingMarks: parseInt(e.target.value) || 0})}
                    min="0"
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Scheduled Date: *</label>
                  <input
                    type="date"
                    value={editingQuiz.scheduledDate}
                    onChange={(e) => setEditingQuiz({...editingQuiz, scheduledDate: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Scheduled Time: *</label>
                  <input
                    type="time"
                    value={editingQuiz.scheduledTime}
                    onChange={(e) => setEditingQuiz({...editingQuiz, scheduledTime: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status:</label>
                <select
                  value={editingQuiz.status}
                  onChange={(e) => setEditingQuiz({...editingQuiz, status: e.target.value})}
                  className="quiz-select-dropdown"
                >
                  <option value="Scheduled">⏰ Scheduled</option>
                  <option value="Active">🟢 Active</option>
                  <option value="Completed">✅ Completed</option>
                </select>
              </div>

              <div className="form-info">
                <p>📝 Selected Questions: <strong>{editingQuiz.questionIds.length}</strong></p>
                <p>⏱️ Duration: <strong>{editingQuiz.duration} minutes</strong></p>
                <p>📅 Status: <strong>{editingQuiz.status}</strong></p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsEditQuizModalOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={handleUpdateQuiz}>Update Quiz</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
