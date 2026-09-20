package com.aryansingh.portfolio.dto;

public record AuthResponse(String token, String username, String role, long expiresIn) {}
