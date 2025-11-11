package com.quiz.model;

import java.io.Serializable;

/**
 * MEMBER 3: Answer Model with Serialization
 * Network Concept: Data Serialization for network transmission
 */
public class Answer implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String studentId;
    private int questionId;
    private int selectedOption;
    private long submissionTime;
    private boolean isCorrect;
    
    public Answer(String studentId, int questionId, int selectedOption) {
        this.studentId = studentId;
        this.questionId = questionId;
        this.selectedOption = selectedOption;
        this.submissionTime = System.currentTimeMillis();
        this.isCorrect = false;
    }
    
    /**
     * Convert answer to JSON format
     */
    public String toJson() {
        return String.format("{\"studentId\":\"%s\",\"questionId\":%d,\"selectedOption\":%d,\"isCorrect\":%s}",
            studentId, questionId, selectedOption, isCorrect);
    }
    
    // Getters and Setters
    public String getStudentId() {
        return studentId;
    }
    
    public int getQuestionId() {
        return questionId;
    }
    
    public int getSelectedOption() {
        return selectedOption;
    }
    
    public long getSubmissionTime() {
        return submissionTime;
    }
    
    public boolean isCorrect() {
        return isCorrect;
    }
    
    public void setCorrect(boolean correct) {
        isCorrect = correct;
    }
}
