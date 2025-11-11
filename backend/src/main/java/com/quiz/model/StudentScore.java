package com.quiz.model;

/**
 * MEMBER 4: Student Score Model
 * Stores individual student score information
 */
public class StudentScore {
    private final String studentId;
    private final String studentName;
    private int totalScore;
    private int correctAnswers;
    private int totalQuestions;
    
    public StudentScore(String studentId, String studentName) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.totalScore = 0;
        this.correctAnswers = 0;
        this.totalQuestions = 0;
    }
    
    /**
     * Add points to total score
     */
    public synchronized void addPoints(int points) {
        this.totalScore += points;
    }
    
    /**
     * Increment correct answers count
     */
    public synchronized void incrementCorrectAnswers() {
        this.correctAnswers++;
    }
    
    /**
     * Increment total questions answered
     */
    public synchronized void incrementTotalQuestions() {
        this.totalQuestions++;
    }
    
    /**
     * Calculate percentage
     */
    public double getPercentage() {
        if (totalQuestions == 0) return 0.0;
        return (correctAnswers * 100.0) / totalQuestions;
    }
    
    /**
     * Reset score
     */
    public synchronized void reset() {
        this.totalScore = 0;
        this.correctAnswers = 0;
        this.totalQuestions = 0;
    }
    
    // Getters
    public String getStudentId() {
        return studentId;
    }
    
    public String getStudentName() {
        return studentName;
    }
    
    public int getTotalScore() {
        return totalScore;
    }
    
    public int getCorrectAnswers() {
        return correctAnswers;
    }
    
    public int getTotalQuestions() {
        return totalQuestions;
    }
}
