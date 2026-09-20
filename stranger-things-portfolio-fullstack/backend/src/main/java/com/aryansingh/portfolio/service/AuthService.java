package com.aryansingh.portfolio.service;

import com.aryansingh.portfolio.dto.AuthRequest;
import com.aryansingh.portfolio.dto.AuthResponse;
import com.aryansingh.portfolio.exception.BadRequestException;
import com.aryansingh.portfolio.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    public AuthService(AuthenticationManager authManager, JwtUtil jwtUtil) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse login(AuthRequest req) {
        try {
            Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
            );
            String role = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");
            String token = jwtUtil.generateToken(req.getUsername(), role);
            return new AuthResponse(token, req.getUsername(), role, jwtUtil.getExpirationMs());
        } catch (BadCredentialsException e) {
            throw new BadRequestException("Invalid credentials — access denied");
        }
    }
}
