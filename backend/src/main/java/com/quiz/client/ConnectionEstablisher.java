package com.quiz.client;

import java.io.IOException;
import java.net.Socket;

/**
 * MEMBER 5: Connection Establisher
 * Handles connection establishment with retry logic
 */
public class ConnectionEstablisher {
    private static final int DEFAULT_MAX_RETRIES = 3;
    private static final int RETRY_DELAY_MS = 2000;
    
    /**
     * Attempt to establish connection to server
     */
    public static Socket establishConnection(String host, int port) throws IOException {
        return new Socket(host, port);
    }
    
    /**
     * Attempt connection with retry logic
     */
    public static Socket establishConnectionWithRetry(String host, int port, int maxRetries) {
        int attempts = 0;
        
        while (attempts < maxRetries) {
            try {
                System.out.println("Connection attempt " + (attempts + 1) + " of " + maxRetries);
                Socket socket = new Socket(host, port);
                System.out.println("Successfully connected to " + host + ":" + port);
                return socket;
                
            } catch (IOException e) {
                attempts++;
                if (attempts < maxRetries) {
                    System.out.println("Connection failed. Retrying in " + (RETRY_DELAY_MS / 1000) + " seconds...");
                    try {
                        Thread.sleep(RETRY_DELAY_MS);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                } else {
                    System.err.println("Failed to connect after " + maxRetries + " attempts: " + e.getMessage());
                }
            }
        }
        
        return null;
    }
    
    /**
     * Check if server is reachable
     */
    public static boolean isServerReachable(String host, int port, int timeout) {
        try (Socket socket = new Socket()) {
            socket.connect(new java.net.InetSocketAddress(host, port), timeout);
            return true;
        } catch (IOException e) {
            return false;
        }
    }
}
