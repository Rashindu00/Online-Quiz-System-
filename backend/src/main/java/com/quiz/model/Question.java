package com.quiz.model;

import java.io.Serializable;

/**
 * MEMBER 3: Question Model with Serialization
 * Network Concept: Data Serialization for network transmission
 * 
 * This class represents a quiz question and can be serialized for network communication.
 */
public class Question implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private int id;
    private String text;
    private String[] options;
    private int correctAnswerIndex;
    private int timeLimit; // in seconds
    
    public Question(int id, String text, String[] options, int correctAnswerIndex, int timeLimit) {
        this.id = id;
        this.text = text;
        this.options = options;
        this.correctAnswerIndex = correctAnswerIndex;
        this.timeLimit = timeLimit;
    }
    
    /**
     * Convert question to JSON format for network transmission
     */
    public String toJson() {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"id\":").append(id).append(",");
        json.append("\"text\":\"").append(text).append("\",");
        json.append("\"options\":[");
        
        for (int i = 0; i < options.length; i++) {
            json.append("\"").append(options[i]).append("\"");
            if (i < options.length - 1) {
                json.append(",");
            }
        }
        
        json.append("],");
        json.append("\"timeLimit\":").append(timeLimit);
        json.append("}");
        
        return json.toString();
    }
    
    /**
     * Check if the provided answer is correct
     */
    public boolean isCorrectAnswer(int selectedOption) {
        return selectedOption == correctAnswerIndex;
    }
    
    // Getters
    public int getId() {
        return id;
    }
    
    public String getText() {
        return text;
    }
    
    public String[] getOptions() {
        return options;
    }
    
    public int getCorrectAnswerIndex() {
        return correctAnswerIndex;
    }
    
    public int getTimeLimit() {
        return timeLimit;
    }
}
