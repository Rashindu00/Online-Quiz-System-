/**
 * Socket Service for communicating with Java backend server
 * Handles WebSocket-like communication over TCP sockets
 */

class SocketService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.listeners = {};
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  /**
   * Connect to the backend server
   */
  connect(host = 'localhost', port = 8080) {
    return new Promise((resolve, reject) => {
      try {
        // Note: For actual implementation, you would need a WebSocket server
        // or use a library like socket.io. This is a placeholder structure.
        
        // Simulating connection for demonstration (DEMO MODE)
        console.log(`Attempting to connect to ${host}:${port}`);
        console.log('Running in DEMO MODE - simulating server connection');
        
        // In a real implementation, you would create a WebSocket connection
        // this.ws = new WebSocket(`ws://${host}:${port}`);
        
        // Simulate connection delay
        setTimeout(() => {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          
          this.emit('connected', { host, port });
          console.log('Connected successfully (DEMO MODE)');
          resolve(true);
        }, 500);
        
      } catch (error) {
        console.error('Connection failed:', error);
        this.isConnected = false;
        reject(error);
      }
    });
  }

  /**
   * Register a student with the server
   */
  register(studentName, studentId) {
    const data = {
      name: studentName,
      id: studentId
    };
    
    this.send('REGISTER', data);
    
    // Simulate registration success (DEMO MODE)
    setTimeout(() => {
      this.emit('registered', { success: true, studentName, studentId });
      console.log('Student registered successfully (DEMO MODE)');
    }, 300);
  }

  /**
   * Submit an answer to the server
   */
  submitAnswer(questionId, selectedOption) {
    const data = {
      questionId,
      selectedOption
    };
    
    this.send('ANSWER', data);
  }

  /**
   * Send a message to the server
   */
  send(type, data) {
    if (!this.isConnected) {
      console.error('Not connected to server');
      return;
    }

    const message = `${type}:${JSON.stringify(data)}`;
    console.log('Sending:', message);
    
    // In real implementation:
    // this.ws.send(message);
    
    // For demonstration, simulate server response
    this.simulateServerResponse(type, data);
  }

  /**
   * Listen for specific message types
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (!this.listeners[event]) return;
    
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  /**
   * Emit event to listeners
   */
  emit(event, data) {
    if (!this.listeners[event]) return;
    
    this.listeners[event].forEach(callback => {
      callback(data);
    });
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
    this.isConnected = false;
    this.emit('disconnected');
    console.log('Disconnected from server');
  }

  /**
   * Check connection status
   */
  getConnectionStatus() {
    return this.isConnected;
  }

  /**
   * Simulate server responses for demonstration
   * In production, this would be handled by actual server responses
   */
  simulateServerResponse(type, data) {
    setTimeout(() => {
      if (type === 'REGISTER') {
        this.emit('registered', { success: true, message: 'Registration successful' });
      } else if (type === 'ANSWER') {
        // Simulate answer feedback
        const isCorrect = Math.random() > 0.5;
        this.emit('feedback', {
          correct: isCorrect,
          points: isCorrect ? 10 : 0
        });
      }
    }, 500);
  }

  /**
   * Simulate receiving a question from server
   */
  simulateQuestion(questionData) {
    this.emit('question', questionData);
  }

  /**
   * Simulate receiving results from server
   */
  simulateResults(resultsData) {
    this.emit('results', resultsData);
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
