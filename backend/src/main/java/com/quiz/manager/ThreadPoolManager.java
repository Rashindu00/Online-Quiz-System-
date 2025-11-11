package com.quiz.manager;

import java.util.concurrent.*;

/**
 * MEMBER 2: Thread Pool Manager
 * Manages a pool of threads for efficient resource utilization
 */
public class ThreadPoolManager {
    private final ExecutorService threadPool;
    private static final int MAX_THREADS = 50;
    
    public ThreadPoolManager() {
        // Create a fixed thread pool
        this.threadPool = Executors.newFixedThreadPool(MAX_THREADS);
    }
    
    /**
     * Submit a new task to the thread pool
     */
    public void submitTask(Runnable task) {
        threadPool.submit(task);
    }
    
    /**
     * Shutdown the thread pool
     */
    public void shutdown() {
        threadPool.shutdown();
        try {
            if (!threadPool.awaitTermination(5, TimeUnit.SECONDS)) {
                threadPool.shutdownNow();
            }
        } catch (InterruptedException e) {
            threadPool.shutdownNow();
        }
    }
    
    /**
     * Get active thread count
     */
    public int getActiveThreadCount() {
        if (threadPool instanceof ThreadPoolExecutor) {
            return ((ThreadPoolExecutor) threadPool).getActiveCount();
        }
        return 0;
    }
}
