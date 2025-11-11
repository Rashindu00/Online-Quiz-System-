package com.quiz.client;

import java.io.*;
import java.net.*;
import java.util.Scanner;

/**
 * MEMBER 5: Client-Side Socket Programming
 * Network Concept: Client-Side Socket Programming & Connection Management
 * 
 * This class handles the client-side connection to the quiz server.
 * It establishes a socket connection, sends student information,
 * receives questions, and submits answers.
 */
public class QuizClient {
    private static final String SERVER_HOST = "localhost";
    private static final int SERVER_PORT = 8080;
    
    private Socket socket;
    private BufferedReader input;
    private PrintWriter output;
    private boolean isConnected;
    private String studentId;
    private String studentName;
    
    public QuizClient() {
        this.isConnected = false;
    }
    
    /**
     * Connect to the quiz server
     */
    public boolean connect(String studentName, String studentId) {
        try {
            // Establish socket connection to server
            socket = new Socket(SERVER_HOST, SERVER_PORT);
            
            // Initialize input/output streams
            input = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            output = new PrintWriter(socket.getOutputStream(), true);
            
            this.studentName = studentName;
            this.studentId = studentId;
            this.isConnected = true;
            
            log("Connected to server at " + SERVER_HOST + ":" + SERVER_PORT);
            
            // Register with server
            registerWithServer();
            
            // Start listening for server messages
            new Thread(() -> listenForMessages()).start();
            
            return true;
            
        } catch (IOException e) {
            log("Failed to connect to server: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Register student information with the server
     */
    private void registerWithServer() {
        String registrationData = String.format("REGISTER:{\"name\":\"%s\",\"id\":\"%s\"}", 
            studentName, studentId);
        sendMessage(registrationData);
        log("Registration data sent to server");
    }
    
    /**
     * Listen for incoming messages from server
     */
    private void listenForMessages() {
        try {
            String message;
            while (isConnected && (message = input.readLine()) != null) {
                handleServerMessage(message);
            }
        } catch (IOException e) {
            if (isConnected) {
                log("Connection lost: " + e.getMessage());
                disconnect();
            }
        }
    }
    
    /**
     * Handle messages received from server
     */
    private void handleServerMessage(String message) {
        if (message.startsWith("REGISTERED:")) {
            log("Successfully registered with server");
            log("Waiting for quiz to start...");
            
        } else if (message.startsWith("QUESTION:")) {
            handleQuestion(message);
            
        } else if (message.startsWith("FEEDBACK:")) {
            handleFeedback(message);
            
        } else if (message.startsWith("RESULTS:")) {
            handleResults(message);
            
        } else if (message.startsWith("STATUS:")) {
            log("Server status: " + message.substring("STATUS:".length()));
        }
    }
    
    /**
     * Handle incoming question from server
     */
    private void handleQuestion(String message) {
        String questionJson = message.substring("QUESTION:".length());
        
        // Parse question data
        int questionId = extractIntValue(questionJson, "id");
        String questionText = extractStringValue(questionJson, "text");
        int timeLimit = extractIntValue(questionJson, "timeLimit");
        
        // Display question
        System.out.println("\n" + repeat("=", 50));
        System.out.println("QUESTION " + questionId);
        System.out.println(repeat("=", 50));
        System.out.println(questionText);
        System.out.println("\nOptions:");
        
        // Parse and display options
        displayOptions(questionJson);
        
        System.out.println("\nTime limit: " + timeLimit + " seconds");
        System.out.print("Your answer (0-3): ");
    }
    
    /**
     * Display question options
     */
    private void displayOptions(String questionJson) {
        // Extract options array
        int optionsStart = questionJson.indexOf("[");
        int optionsEnd = questionJson.indexOf("]");
        String optionsStr = questionJson.substring(optionsStart + 1, optionsEnd);
        
        String[] options = optionsStr.split("\",\"");
        for (int i = 0; i < options.length; i++) {
            String option = options[i].replace("\"", "");
            System.out.println(i + ") " + option);
        }
    }
    
    /**
     * Handle feedback from server after answer submission
     */
    private void handleFeedback(String message) {
        String feedbackJson = message.substring("FEEDBACK:".length());
        
        boolean correct = extractStringValue(feedbackJson, "correct").equals("true");
        int points = extractIntValue(feedbackJson, "points");
        
        System.out.println("\n" + repeat("-", 50));
        if (correct) {
            System.out.println("✓ CORRECT! You earned " + points + " points!");
        } else {
            System.out.println("✗ WRONG! No points earned.");
        }
        System.out.println(repeat("-", 50));
        System.out.println("Waiting for next question...\n");
    }
    
    /**
     * Handle final results from server
     */
    private void handleResults(String message) {
        String resultsJson = message.substring("RESULTS:".length());
        
        System.out.println("\n" + repeat("=", 50));
        System.out.println("QUIZ COMPLETED - FINAL RESULTS");
        System.out.println(repeat("=", 50));
        
        // Display leaderboard
        displayLeaderboard(resultsJson);
    }
    
    /**
     * Display leaderboard
     */
    private void displayLeaderboard(String resultsJson) {
        System.out.println("\nLEADERBOARD:");
        System.out.println(repeat("-", 50));
        System.out.printf("%-5s %-20s %-10s %-10s%n", "Rank", "Name", "Score", "Percentage");
        System.out.println(repeat("-", 50));
        
        // Parse leaderboard data
        int leaderboardStart = resultsJson.indexOf("[");
        int leaderboardEnd = resultsJson.lastIndexOf("]");
        String leaderboardData = resultsJson.substring(leaderboardStart + 1, leaderboardEnd);
        
        // Split by objects (simple parsing)
        String[] entries = leaderboardData.split("\\},\\{");
        
        for (String entry : entries) {
            entry = entry.replace("{", "").replace("}", "");
            
            int rank = extractIntValueDirect(entry, "rank");
            String name = extractStringValueDirect(entry, "studentName");
            int score = extractIntValueDirect(entry, "totalScore");
            double percentage = extractDoubleValueDirect(entry, "percentage");
            
            String medal = "";
            if (rank == 1) medal = "🥇";
            else if (rank == 2) medal = "🥈";
            else if (rank == 3) medal = "🥉";
            
            System.out.printf("%-5s %-20s %-10d %-10.1f%%%n",
                rank + medal, name, score, percentage);
        }
        
        System.out.println(repeat("-", 50));
        System.out.println("\nThank you for participating!");
    }
    
    /**
     * Submit an answer to the server
     */
    public void submitAnswer(int questionId, int selectedOption) {
        String answerData = String.format("ANSWER:{\"questionId\":%d,\"selectedOption\":%d}",
            questionId, selectedOption);
        sendMessage(answerData);
        log("Answer submitted for question " + questionId);
    }
    
    /**
     * Send a message to the server
     */
    private void sendMessage(String message) {
        if (output != null && isConnected) {
            output.println(message);
        }
    }
    
    /**
     * Disconnect from server
     */
    public void disconnect() {
        try {
            isConnected = false;
            
            if (input != null) input.close();
            if (output != null) output.close();
            if (socket != null) socket.close();
            
            log("Disconnected from server");
            
        } catch (IOException e) {
            log("Error disconnecting: " + e.getMessage());
        }
    }
    
    /**
     * Check if client is connected
     */
    public boolean isConnected() {
        return isConnected;
    }
    
    /**
     * Retry connection with exponential backoff
     */
    public boolean retryConnection(String studentName, String studentId, int maxRetries) {
        int retryCount = 0;
        int retryDelay = 1000; // Start with 1 second
        
        while (retryCount < maxRetries) {
            log("Connection attempt " + (retryCount + 1) + " of " + maxRetries);
            
            if (connect(studentName, studentId)) {
                return true;
            }
            
            retryCount++;
            if (retryCount < maxRetries) {
                try {
                    log("Retrying in " + (retryDelay / 1000) + " seconds...");
                    Thread.sleep(retryDelay);
                    retryDelay *= 2; // Exponential backoff
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }
        
        log("Failed to connect after " + maxRetries + " attempts");
        return false;
    }
    
    // Helper methods for parsing
    private String extractStringValue(String json, String key) {
        String searchKey = "\"" + key + "\":\"";
        int startIndex = json.indexOf(searchKey) + searchKey.length();
        int endIndex = json.indexOf("\"", startIndex);
        return json.substring(startIndex, endIndex);
    }
    
    private int extractIntValue(String json, String key) {
        String searchKey = "\"" + key + "\":";
        int startIndex = json.indexOf(searchKey) + searchKey.length();
        int endIndex = json.indexOf(",", startIndex);
        if (endIndex == -1) {
            endIndex = json.indexOf("}", startIndex);
        }
        return Integer.parseInt(json.substring(startIndex, endIndex).trim());
    }
    
    private String extractStringValueDirect(String str, String key) {
        String searchKey = "\"" + key + "\":\"";
        int startIndex = str.indexOf(searchKey) + searchKey.length();
        int endIndex = str.indexOf("\"", startIndex);
        return str.substring(startIndex, endIndex);
    }
    
    private int extractIntValueDirect(String str, String key) {
        String searchKey = "\"" + key + "\":";
        int startIndex = str.indexOf(searchKey) + searchKey.length();
        int endIndex = str.indexOf(",", startIndex);
        if (endIndex == -1) {
            endIndex = str.length();
        }
        return Integer.parseInt(str.substring(startIndex, endIndex).trim());
    }
    
    private double extractDoubleValueDirect(String str, String key) {
        String searchKey = "\"" + key + "\":";
        int startIndex = str.indexOf(searchKey) + searchKey.length();
        int endIndex = str.indexOf(",", startIndex);
        if (endIndex == -1) {
            endIndex = str.length();
        }
        return Double.parseDouble(str.substring(startIndex, endIndex).trim());
    }
    
    /**
     * Simple repeat helper for older Java versions
     */
    private String repeat(String s, int count) {
        if (s == null || count <= 0) return "";
        StringBuilder sb = new StringBuilder(s.length() * count);
        for (int i = 0; i < count; i++) {
            sb.append(s);
        }
        return sb.toString();
    }
    
    private void log(String message) {
        System.out.println("[CLIENT] " + message);
    }
    
    /**
     * Main method for testing client
     */
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("=== QUIZ CLIENT ===");
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        
        System.out.print("Enter your student ID: ");
        String id = scanner.nextLine();
        
        QuizClient client = new QuizClient();
        
        if (client.connect(name, id)) {
            System.out.println("\nConnected! Waiting for quiz to start...");
            System.out.println("Type 'quit' to exit\n");
            
            // Handle user input for answers
            while (client.isConnected()) {
                if (scanner.hasNextLine()) {
                    String input = scanner.nextLine();
                    
                    if (input.equalsIgnoreCase("quit")) {
                        client.disconnect();
                        break;
                    }
                    
                    // If it's a number, treat as answer
                    try {
                        int answer = Integer.parseInt(input);
                        // Note: questionId should be tracked, using 1 for demo
                        client.submitAnswer(1, answer);
                    } catch (NumberFormatException e) {
                        // Ignore invalid input
                    }
                }
            }
        } else {
            System.out.println("Failed to connect to server. Please try again.");
        }
        
        scanner.close();
    }
}
