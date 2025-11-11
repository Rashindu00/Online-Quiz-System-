package com.quiz.handler;

/**
 * MEMBER 3: JSON Parser
 * Simple JSON parser for network data transmission
 */
public class JSONParser {
    
    /**
     * Create a JSON object string
     */
    public static String createJson(String... keyValuePairs) {
        if (keyValuePairs.length % 2 != 0) {
            throw new IllegalArgumentException("Key-value pairs must be even");
        }
        
        StringBuilder json = new StringBuilder("{");
        
        for (int i = 0; i < keyValuePairs.length; i += 2) {
            String key = keyValuePairs[i];
            String value = keyValuePairs[i + 1];
            
            json.append("\"").append(key).append("\":");
            
            // Check if value is a number or boolean
            if (isNumeric(value) || isBoolean(value)) {
                json.append(value);
            } else {
                json.append("\"").append(value).append("\"");
            }
            
            if (i < keyValuePairs.length - 2) {
                json.append(",");
            }
        }
        
        json.append("}");
        return json.toString();
    }
    
    /**
     * Create a JSON array string
     */
    public static String createJsonArray(String... items) {
        StringBuilder json = new StringBuilder("[");
        
        for (int i = 0; i < items.length; i++) {
            json.append("\"").append(items[i]).append("\"");
            if (i < items.length - 1) {
                json.append(",");
            }
        }
        
        json.append("]");
        return json.toString();
    }
    
    /**
     * Extract a value from JSON string
     */
    public static String getValue(String json, String key) {
        String searchKey = "\"" + key + "\":";
        int startIndex = json.indexOf(searchKey);
        if (startIndex == -1) return null;
        
        startIndex += searchKey.length();
        
        // Skip whitespace
        while (startIndex < json.length() && Character.isWhitespace(json.charAt(startIndex))) {
            startIndex++;
        }
        
        // Check if value is a string (starts with ")
        if (json.charAt(startIndex) == '"') {
            startIndex++; // Skip opening quote
            int endIndex = json.indexOf("\"", startIndex);
            return json.substring(startIndex, endIndex);
        } else {
            // Number or boolean
            int endIndex = json.indexOf(",", startIndex);
            if (endIndex == -1) {
                endIndex = json.indexOf("}", startIndex);
            }
            return json.substring(startIndex, endIndex).trim();
        }
    }
    
    /**
     * Check if string is numeric
     */
    private static boolean isNumeric(String str) {
        try {
            Double.parseDouble(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
    
    /**
     * Check if string is boolean
     */
    private static boolean isBoolean(String str) {
        return str.equals("true") || str.equals("false");
    }
}
