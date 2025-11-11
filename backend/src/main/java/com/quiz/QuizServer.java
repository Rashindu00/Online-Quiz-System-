package com.quiz;

import com.quiz.handler.ClientHandler;
import com.quiz.manager.ConnectionManager;
import com.quiz.manager.ScoreManager;
import com.quiz.model.Question;

import java.io.*;
import java.net.*;
import java.util.*;
import java.text.SimpleDateFormat;

/**
 * MEMBER 1: Server Setup & Admin Dashboard
 * Network Concept: ServerSocket & Multi-client Connection Management
 * 
 * This class implements the main quiz server using ServerSocket.
 * It listens on port 8080 and accepts multiple client connections.
 */
public class QuizServer {
    private static final int PORT = 8080;
    private ServerSocket serverSocket;
    private ConnectionManager connectionManager;
    private ScoreManager scoreManager;
    private boolean isRunning;
    private boolean quizStarted;
    private List<Question> questionBank;
    private int currentQuestionIndex;
    
    public QuizServer() {
        this.connectionManager = new ConnectionManager();
        this.scoreManager = new ScoreManager();
        this.isRunning = false;
        this.quizStarted = false;
        this.currentQuestionIndex = 0;
        loadQuestionBank();
    }
    
    /**
     * Load quiz questions into the question bank
     */
    private void loadQuestionBank() {
        questionBank = new ArrayList<>();
        
        // Add 10 Network Programming questions
        questionBank.add(new Question(1, 
            "What is the purpose of ServerSocket in Java?",
            new String[]{"Create client connections", "Listen for client requests", "Send HTTP requests", "Manage databases"},
            1, 30));
        
        questionBank.add(new Question(2,
            "Which package contains the Socket class?",
            new String[]{"java.io", "java.net", "java.util", "java.lang"},
            1, 30));
        
        questionBank.add(new Question(3,
            "What is multithreading used for in network programming?",
            new String[]{"Faster execution", "Handle multiple clients simultaneously", "Reduce memory usage", "Simplify code"},
            1, 30));
        
        questionBank.add(new Question(4,
            "Which method is used to accept incoming client connections?",
            new String[]{"connect()", "accept()", "listen()", "bind()"},
            1, 30));
        
        questionBank.add(new Question(5,
            "What does JSON stand for?",
            new String[]{"Java Standard Object Notation", "JavaScript Object Notation", "Java Serialized Object Network", "JavaScript Online Notation"},
            1, 30));
        
        questionBank.add(new Question(6,
            "Which stream is used for reading data from a socket?",
            new String[]{"FileInputStream", "DataInputStream", "InputStream", "BufferedReader"},
            2, 30));
        
        questionBank.add(new Question(7,
            "What is synchronization in multithreading?",
            new String[]{"Running threads simultaneously", "Preventing race conditions", "Creating new threads", "Stopping threads"},
            1, 30));
        
        questionBank.add(new Question(8,
            "Which protocol is connection-oriented?",
            new String[]{"UDP", "ICMP", "TCP", "HTTP"},
            2, 30));
        
        questionBank.add(new Question(9,
            "What is the default port for HTTP?",
            new String[]{"21", "22", "80", "443"},
            2, 30));
        
        questionBank.add(new Question(10,
            "Which keyword is used to make a method thread-safe?",
            new String[]{"volatile", "synchronized", "static", "final"},
            1, 30));
    }
    
    /**
     * Start the quiz server and begin listening for connections
     */
    public void startServer() {
        try {
            serverSocket = new ServerSocket(PORT);
            isRunning = true;
            log("Server started on port " + PORT);
            log("Waiting for client connections...");
            
            // Start accepting client connections in a separate thread
            new Thread(() -> acceptConnections()).start();
            
        } catch (IOException e) {
            log("Error starting server: " + e.getMessage());
        }
    }
    
    /**
     * Accept incoming client connections
     * Creates a new ClientHandler thread for each connection
     */
    private void acceptConnections() {
        while (isRunning) {
            try {
                Socket clientSocket = serverSocket.accept();
                
                // Create a new handler for this client (Member 2's multithreading)
                ClientHandler clientHandler = new ClientHandler(clientSocket, connectionManager, scoreManager, this);
                connectionManager.addClient(clientHandler);
                clientHandler.start();
                
                log("New client connected. Total clients: " + connectionManager.getClientCount());
                
            } catch (IOException e) {
                if (isRunning) {
                    log("Error accepting connection: " + e.getMessage());
                }
            }
        }
    }
    
    /**
     * Start the quiz - broadcast first question to all connected clients
     */
    public void startQuiz() {
        if (quizStarted) {
            log("Quiz already started!");
            return;
        }
        
        if (connectionManager.getClientCount() == 0) {
            log("No clients connected. Cannot start quiz.");
            return;
        }
        
        quizStarted = true;
        currentQuestionIndex = 0;
        log("Quiz started! Broadcasting first question...");
        broadcastCurrentQuestion();
    }
    
    /**
     * Broadcast the current question to all connected clients
     */
    public void broadcastCurrentQuestion() {
        if (currentQuestionIndex >= questionBank.size()) {
            endQuiz();
            return;
        }
        
        Question currentQuestion = questionBank.get(currentQuestionIndex);
        String questionJson = currentQuestion.toJson();
        
        connectionManager.broadcastMessage("QUESTION:" + questionJson);
        log("Question " + (currentQuestionIndex + 1) + " broadcasted to all clients");
    }
    
    /**
     * Move to the next question
     */
    public void nextQuestion() {
        if (!quizStarted) {
            log("Quiz not started yet!");
            return;
        }
        
        currentQuestionIndex++;
        
        if (currentQuestionIndex >= questionBank.size()) {
            log("All questions completed!");
            endQuiz();
        } else {
            log("Moving to question " + (currentQuestionIndex + 1));
            broadcastCurrentQuestion();
        }
    }
    
    /**
     * End the quiz and send results to all clients
     */
    public void endQuiz() {
        if (!quizStarted) {
            log("Quiz not started yet!");
            return;
        }
        
        log("Quiz ended! Calculating results...");
        
        // Generate leaderboard (Member 4's functionality)
        String leaderboardJson = scoreManager.generateLeaderboard();
        
        // Broadcast results to all clients
        connectionManager.broadcastMessage("RESULTS:" + leaderboardJson);
        
        quizStarted = false;
        currentQuestionIndex = 0;
        
        log("Results sent to all clients");
    }
    
    /**
     * Stop the server
     */
    public void stopServer() {
        try {
            isRunning = false;
            quizStarted = false;
            
            // Disconnect all clients
            connectionManager.disconnectAll();
            
            // Close server socket
            if (serverSocket != null && !serverSocket.isClosed()) {
                serverSocket.close();
            }
            
            log("Server stopped");
            
        } catch (IOException e) {
            log("Error stopping server: " + e.getMessage());
        }
    }
    
    /**
     * Get current question for evaluation
     */
    public Question getCurrentQuestion() {
        if (currentQuestionIndex < questionBank.size()) {
            return questionBank.get(currentQuestionIndex);
        }
        return null;
    }
    
    /**
     * Check if quiz is currently running
     */
    public boolean isQuizStarted() {
        return quizStarted;
    }
    
    /**
     * Get server status information
     */
    public String getServerStatus() {
        return String.format("Server: %s | Port: %d | Clients: %d | Quiz: %s",
            isRunning ? "Running" : "Stopped",
            PORT,
            connectionManager.getClientCount(),
            quizStarted ? "Active" : "Inactive");
    }
    
    /**
     * Log messages with timestamp
     */
    public void log(String message) {
        String timestamp = new SimpleDateFormat("HH:mm:ss").format(new Date());
        System.out.println("[" + timestamp + "] " + message);
    }
    
    /**
     * Main method to start the server
     */
    public static void main(String[] args) {
        QuizServer server = new QuizServer();
        server.startServer();
        
        // Simple console commands for testing
        Scanner scanner = new Scanner(System.in);
        System.out.println("\nCommands: start, next, end, status, stop");
        
        while (true) {
            System.out.print("\n> ");
            String command = scanner.nextLine().trim().toLowerCase();
            
            switch (command) {
                case "start":
                    server.startQuiz();
                    break;
                case "next":
                    server.nextQuestion();
                    break;
                case "end":
                    server.endQuiz();
                    break;
                case "status":
                    System.out.println(server.getServerStatus());
                    break;
                case "stop":
                    server.stopServer();
                    scanner.close();
                    System.exit(0);
                    break;
                default:
                    System.out.println("Unknown command");
            }
        }
    }
}
