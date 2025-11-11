package com.quiz.handler;

import com.quiz.model.Question;
import com.quiz.model.Answer;

/**
 * MEMBER 3: Message Handler
 * Network Concept: Input/Output Streams & Data Serialization
 * 
 * Handles message formatting and parsing for network communication
 */
public class MessageHandler {
    
    /**
     * Create a question broadcast message in JSON format
     */
    public static String createQuestionMessage(Question question) {
        return "QUESTION:" + question.toJson();
    }
    
    /**
     * Create an answer message in JSON format
     */
    public static String createAnswerMessage(Answer answer) {
        return "ANSWER:" + answer.toJson();
    }
    
    /**
     * Parse a JSON string and extract a value
     */
    public static String parseJsonValue(String json, String key) {
        String searchKey = "\"" + key + "\":\"";
        int startIndex = json.indexOf(searchKey);
        if (startIndex == -1) {
            // Try without quotes (for numbers)
            searchKey = "\"" + key + "\":";
            startIndex = json.indexOf(searchKey);
            if (startIndex == -1) return null;
            
            startIndex += searchKey.length();
            int endIndex = json.indexOf(",", startIndex);
            if (endIndex == -1) {
                endIndex = json.indexOf("}", startIndex);
            }
            return json.substring(startIndex, endIndex).trim();
        }
        
        startIndex += searchKey.length();
        int endIndex = json.indexOf("\"", startIndex);
        return json.substring(startIndex, endIndex);
    }
    
    /**
     * Parse integer value from JSON
     */
    public static int parseJsonInt(String json, String key) {
        String value = parseJsonValue(json, key);
        return value != null ? Integer.parseInt(value) : 0;
    }
    
    /**
     * Create a registration success message
     */
    public static String createRegistrationMessage(boolean success, String message) {
        return String.format("REGISTER:{\"success\":%s,\"message\":\"%s\"}", success, message);
    }
    
    /**
     * Create a quiz status message
     */
    public static String createStatusMessage(String status, String message) {
        return String.format("STATUS:{\"status\":\"%s\",\"message\":\"%s\"}", status, message);
    }
    
    /**
     * Create a feedback message after answer submission
     */
    public static String createFeedbackMessage(boolean correct, int points, String correctAnswer) {
        return String.format("FEEDBACK:{\"correct\":%s,\"points\":%d,\"correctAnswer\":\"%s\"}",
            correct, points, correctAnswer);
    }
    
    /**
     * Validate JSON message format
     */
    public static boolean isValidJson(String message) {
        if (message == null || message.isEmpty()) return false;
        return message.startsWith("{") && message.endsWith("}");
    }
}
