package com.quiz.manager;

import com.quiz.model.StudentScore;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * MEMBER 4: Score Manager with Thread Synchronization
 * Network Concept: Thread Synchronization & Shared Resources
 * 
 * This class manages scores for all students with thread-safe operations.
 * Uses synchronized methods to prevent race conditions when multiple
 * threads (ClientHandlers) update scores simultaneously.
 */
public class ScoreManager {
    // Thread-safe map to store student scores
    private final Map<String, StudentScore> studentScores;
    private final Object lockObject = new Object();
    
    public ScoreManager() {
        // ConcurrentHashMap for thread-safe operations
        this.studentScores = new ConcurrentHashMap<>();
    }
    
    /**
     * Register a new student
     * Synchronized to prevent race conditions
     */
    public synchronized void registerStudent(String studentId, String studentName) {
        if (!studentScores.containsKey(studentId)) {
            studentScores.put(studentId, new StudentScore(studentId, studentName));
            System.out.println("Student registered in score manager: " + studentName);
        }
    }
    
    /**
     * Add score to a student
     * Synchronized method to ensure thread safety
     */
    public synchronized void addScore(String studentId, int points) {
        StudentScore score = studentScores.get(studentId);
        if (score != null) {
            score.addPoints(points);
            score.incrementCorrectAnswers();
            System.out.println("Score updated for " + score.getStudentName() + 
                             ": " + score.getTotalScore() + " points");
        }
    }
    
    /**
     * Increment total questions answered
     */
    public synchronized void incrementTotalQuestions(String studentId) {
        StudentScore score = studentScores.get(studentId);
        if (score != null) {
            score.incrementTotalQuestions();
        }
    }
    
    /**
     * Get student score
     */
    public StudentScore getStudentScore(String studentId) {
        return studentScores.get(studentId);
    }
    
    /**
     * Generate leaderboard in JSON format
     * Synchronized to ensure consistent data while reading
     */
    public synchronized String generateLeaderboard() {
        // Convert to list and sort by score
        List<StudentScore> scoreList = new ArrayList<>(studentScores.values());
        scoreList.sort((s1, s2) -> Integer.compare(s2.getTotalScore(), s1.getTotalScore()));
        
        // Build JSON leaderboard
        StringBuilder json = new StringBuilder();
        json.append("{\"leaderboard\":[");
        
        for (int i = 0; i < scoreList.size(); i++) {
            StudentScore score = scoreList.get(i);
            json.append("{");
            json.append("\"rank\":").append(i + 1).append(",");
            json.append("\"studentId\":\"").append(score.getStudentId()).append("\",");
            json.append("\"studentName\":\"").append(score.getStudentName()).append("\",");
            json.append("\"totalScore\":").append(score.getTotalScore()).append(",");
            json.append("\"correctAnswers\":").append(score.getCorrectAnswers()).append(",");
            json.append("\"totalQuestions\":").append(score.getTotalQuestions()).append(",");
            json.append("\"percentage\":").append(score.getPercentage());
            json.append("}");
            
            if (i < scoreList.size() - 1) {
                json.append(",");
            }
        }
        
        json.append("]}");
        return json.toString();
    }
    
    /**
     * Get individual student results in JSON format
     */
    public synchronized String getStudentResults(String studentId) {
        StudentScore score = studentScores.get(studentId);
        if (score == null) {
            return "{\"error\":\"Student not found\"}";
        }
        
        // Get rank
        int rank = calculateRank(studentId);
        
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"studentId\":\"").append(score.getStudentId()).append("\",");
        json.append("\"studentName\":\"").append(score.getStudentName()).append("\",");
        json.append("\"totalScore\":").append(score.getTotalScore()).append(",");
        json.append("\"correctAnswers\":").append(score.getCorrectAnswers()).append(",");
        json.append("\"totalQuestions\":").append(score.getTotalQuestions()).append(",");
        json.append("\"percentage\":").append(score.getPercentage()).append(",");
        json.append("\"rank\":").append(rank).append(",");
        json.append("\"totalStudents\":").append(studentScores.size());
        json.append("}");
        
        return json.toString();
    }
    
    /**
     * Calculate student rank
     */
    private int calculateRank(String studentId) {
        StudentScore targetScore = studentScores.get(studentId);
        if (targetScore == null) return -1;
        
        int rank = 1;
        for (StudentScore score : studentScores.values()) {
            if (score.getTotalScore() > targetScore.getTotalScore()) {
                rank++;
            }
        }
        return rank;
    }
    
    /**
     * Reset all scores
     */
    public synchronized void resetAllScores() {
        for (StudentScore score : studentScores.values()) {
            score.reset();
        }
        System.out.println("All scores reset");
    }
    
    /**
     * Get total number of students
     */
    public int getTotalStudents() {
        return studentScores.size();
    }
    
    /**
     * Print leaderboard to console
     */
    public synchronized void printLeaderboard() {
        List<StudentScore> scoreList = new ArrayList<>(studentScores.values());
        scoreList.sort((s1, s2) -> Integer.compare(s2.getTotalScore(), s1.getTotalScore()));
        
        System.out.println("\n========== LEADERBOARD ==========");
        System.out.printf("%-5s %-20s %-10s %-10s%n", "Rank", "Name", "Score", "Correct");
        System.out.println("==================================");
        
        for (int i = 0; i < scoreList.size(); i++) {
            StudentScore score = scoreList.get(i);
            String medal = "";
            if (i == 0) medal = "🥇";
            else if (i == 1) medal = "🥈";
            else if (i == 2) medal = "🥉";
            
            System.out.printf("%-5s %-20s %-10d %-10d%n",
                (i + 1) + medal,
                score.getStudentName(),
                score.getTotalScore(),
                score.getCorrectAnswers());
        }
        System.out.println("==================================\n");
    }
}
