package com.quiz.handler;

import com.quiz.QuizServer;
import com.quiz.manager.ConnectionManager;
import com.quiz.manager.ScoreManager;
import com.quiz.model.Answer;
import com.quiz.model.Question;

import java.io.*;
import java.net.Socket;
import java.util.UUID;

/**
 * MEMBER 2: Multithreading & Concurrent Client Handling
 * Network Concept: Multithreading for Concurrent Clients
 * 
 * Each ClientHandler runs in a separate thread to handle individual client communication.
 * This enables the server to handle multiple clients simultaneously without blocking.
 */
public class ClientHandler extends Thread {
    private final Socket clientSocket;
    private final ConnectionManager connectionManager;
    private final ScoreManager scoreManager;
    private final QuizServer server;
    private final String clientId;
    
    private BufferedReader input;
    private PrintWriter output;
    private String studentName;
    private String studentId;
    private String clientStatus; // "Connected", "Ready", "Answering", "Submitted"
    private boolean isConnected;
    
    public ClientHandler(Socket socket, ConnectionManager connectionManager, 
                        ScoreManager scoreManager, QuizServer server) {
        this.clientSocket = socket;
        this.connectionManager = connectionManager;
        this.scoreManager = scoreManager;
        this.server = server;
        this.clientId = UUID.randomUUID().toString();
        this.clientStatus = "Connected";
        this.isConnected = true;
    }
    
    /**
     * Main thread execution method
     * Handles all communication with this specific client
     */
    @Override
    public void run() {
        try {
            // Initialize input/output streams
            input = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
            output = new PrintWriter(clientSocket.getOutputStream(), true);
            
            // First, receive student information
            String studentInfo = input.readLine();
            if (studentInfo != null && studentInfo.startsWith("REGISTER:")) {
                parseStudentInfo(studentInfo);
                sendMessage("REGISTERED:Success");
                clientStatus = "Ready";
                
                server.log("Student registered: " + studentName + " (ID: " + studentId + ")");
            }
            
            // Listen for messages from this client
            String message;
            while (isConnected && (message = input.readLine()) != null) {
                handleClientMessage(message);
            }
            
        } catch (IOException e) {
            server.log("Client disconnected: " + studentName);
        } finally {
            disconnect();
        }
    }
    
    /**
     * Parse student registration information
     */
    private void parseStudentInfo(String info) {
        // Format: REGISTER:{"name":"John","id":"12345"}
        try {
            String jsonData = info.substring("REGISTER:".length());
            // Simple JSON parsing
            studentName = extractJsonValue(jsonData, "name");
            studentId = extractJsonValue(jsonData, "id");
            
            // Register student in score manager
            scoreManager.registerStudent(studentId, studentName);
            
        } catch (Exception e) {
            studentName = "Unknown";
            studentId = clientId;
        }
    }
    
    /**
     * Simple JSON value extractor
     */
    private String extractJsonValue(String json, String key) {
        String searchKey = "\"" + key + "\":\"";
        int startIndex = json.indexOf(searchKey) + searchKey.length();
        int endIndex = json.indexOf("\"", startIndex);
        return json.substring(startIndex, endIndex);
    }
    
    /**
     * Handle incoming messages from the client
     */
    private void handleClientMessage(String message) {
        if (message.startsWith("ANSWER:")) {
            handleAnswer(message);
        } else if (message.equals("READY")) {
            clientStatus = "Ready";
            server.log(studentName + " is ready");
        } else if (message.equals("PING")) {
            sendMessage("PONG");
        }
    }
    
    /**
     * Handle answer submission from client
     */
    private void handleAnswer(String message) {
        try {
            clientStatus = "Answering";
            
            // Format: ANSWER:{"questionId":1,"selectedOption":2}
            String jsonData = message.substring("ANSWER:".length());
            
            int questionId = Integer.parseInt(extractJsonValue(jsonData, "questionId"));
            int selectedOption = Integer.parseInt(extractJsonValue(jsonData, "selectedOption"));
            
            // Get current question and evaluate (Member 4's functionality)
            Question currentQuestion = server.getCurrentQuestion();
            if (currentQuestion != null && currentQuestion.getId() == questionId) {
                boolean isCorrect = currentQuestion.isCorrectAnswer(selectedOption);
                
                // Update score (synchronized operation)
                if (isCorrect) {
                    scoreManager.addScore(studentId, 10); // 10 points per correct answer
                }
                
                // Send feedback
                String feedback = String.format("FEEDBACK:{\"correct\":%s,\"points\":%d}",
                    isCorrect, isCorrect ? 10 : 0);
                sendMessage(feedback);
                
                clientStatus = "Submitted";
                server.log(studentName + " answered question " + questionId + " - " + 
                          (isCorrect ? "Correct" : "Wrong"));
            }
            
        } catch (Exception e) {
            server.log("Error processing answer from " + studentName + ": " + e.getMessage());
        }
    }
    
    /**
     * Send a message to this client
     * Thread-safe method using synchronized output
     */
    public synchronized void sendMessage(String message) {
        if (output != null && isConnected) {
            output.println(message);
        }
    }
    
    /**
     * Disconnect this client
     */
    public void disconnect() {
        try {
            isConnected = false;
            
            if (input != null) input.close();
            if (output != null) output.close();
            if (clientSocket != null) clientSocket.close();
            
            // Remove from connection manager
            connectionManager.removeClient(this);
            
        } catch (IOException e) {
            server.log("Error disconnecting client: " + e.getMessage());
        }
    }
    
    // Getters
    public String getClientId() {
        return clientId;
    }
    
    public String getStudentName() {
        return studentName != null ? studentName : "Unknown";
    }
    
    public String getStudentId() {
        return studentId;
    }
    
    public String getClientStatus() {
        return clientStatus;
    }
    
    public boolean isConnected() {
        return isConnected;
    }
}
