package com.quiz.manager;

import com.quiz.handler.ClientHandler;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * MEMBER 1: Connection Manager
 * Manages all connected clients and provides thread-safe operations
 */
public class ConnectionManager {
    // Thread-safe list for concurrent access
    private final List<ClientHandler> connectedClients;
    
    public ConnectionManager() {
        this.connectedClients = new CopyOnWriteArrayList<>();
    }
    
    /**
     * Add a new client to the connected clients list
     */
    public synchronized void addClient(ClientHandler client) {
        connectedClients.add(client);
        System.out.println("Client added: " + client.getClientId());
    }
    
    /**
     * Remove a client from the connected clients list
     */
    public synchronized void removeClient(ClientHandler client) {
        connectedClients.remove(client);
        System.out.println("Client removed: " + client.getClientId());
    }
    
    /**
     * Get the number of connected clients
     */
    public int getClientCount() {
        return connectedClients.size();
    }
    
    /**
     * Get list of all connected client names
     */
    public List<String> getConnectedClientNames() {
        List<String> names = new ArrayList<>();
        for (ClientHandler client : connectedClients) {
            names.add(client.getStudentName() + " (" + client.getClientStatus() + ")");
        }
        return names;
    }
    
    /**
     * Broadcast a message to all connected clients
     */
    public void broadcastMessage(String message) {
        for (ClientHandler client : connectedClients) {
            client.sendMessage(message);
        }
    }
    
    /**
     * Disconnect all clients
     */
    public void disconnectAll() {
        for (ClientHandler client : connectedClients) {
            client.disconnect();
        }
        connectedClients.clear();
    }
    
    /**
     * Get all connected clients
     */
    public List<ClientHandler> getAllClients() {
        return new ArrayList<>(connectedClients);
    }
}
