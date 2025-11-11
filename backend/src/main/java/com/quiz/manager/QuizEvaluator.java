package com.quiz.manager;

import com.quiz.model.Question;
import com.quiz.model.Answer;

/**
 * MEMBER 4: Quiz Evaluator
 * Evaluates answers and calculates scores
 */
public class QuizEvaluator {
    private static final int POINTS_PER_CORRECT_ANSWER = 10;
    
    /**
     * Evaluate an answer against the correct answer
     */
    public static boolean evaluateAnswer(Question question, int selectedOption) {
        return question.isCorrectAnswer(selectedOption);
    }
    
    /**
     * Calculate points for an answer
     */
    public static int calculatePoints(boolean isCorrect) {
        return isCorrect ? POINTS_PER_CORRECT_ANSWER : 0;
    }
    
    /**
     * Calculate percentage score
     */
    public static double calculatePercentage(int correctAnswers, int totalQuestions) {
        if (totalQuestions == 0) return 0.0;
        return (correctAnswers * 100.0) / totalQuestions;
    }
    
    /**
     * Get grade based on percentage
     */
    public static String getGrade(double percentage) {
        if (percentage >= 90) return "A+";
        else if (percentage >= 80) return "A";
        else if (percentage >= 70) return "B+";
        else if (percentage >= 60) return "B";
        else if (percentage >= 50) return "C";
        else if (percentage >= 40) return "D";
        else return "F";
    }
    
    /**
     * Determine if student passed
     */
    public static boolean isPassed(double percentage) {
        return percentage >= 40; // 40% passing mark
    }
}
