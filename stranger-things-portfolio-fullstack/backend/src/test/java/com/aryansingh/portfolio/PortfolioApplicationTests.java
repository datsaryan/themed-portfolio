package com.aryansingh.portfolio;

import com.aryansingh.portfolio.dto.AuthRequest;
import com.aryansingh.portfolio.model.User;
import com.aryansingh.portfolio.repository.*;
import com.aryansingh.portfolio.security.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PortfolioApplicationTests {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired UserRepository userRepository;
    @Autowired PasswordEncoder passwordEncoder;
    @Autowired JwtUtil jwtUtil;
    @Autowired ProfileRepository profileRepository;
    @Autowired ProjectRepository projectRepository;
    @Autowired SkillCategoryRepository skillCategoryRepository;

    private String adminToken;

    @BeforeEach
    void setup() {
        if (!userRepository.existsByUsername("testadmin")) {
            userRepository.save(new User("testadmin", passwordEncoder.encode("testpass123"), "ROLE_ADMIN"));
        }
        adminToken = jwtUtil.generateToken("testadmin", "ROLE_ADMIN");
    }

    @Test
    void contextLoads() {
        // Verifies Spring context starts without errors
    }

    @Test
    void adminLogin_returnsToken() throws Exception {
        AuthRequest req = new AuthRequest("testadmin", "testpass123");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").isNotEmpty())
            .andExpect(jsonPath("$.username").value("testadmin"))
            .andExpect(jsonPath("$.role").value("ROLE_ADMIN"));
    }

    @Test
    void adminLogin_wrongPassword_returns400() throws Exception {
        AuthRequest req = new AuthRequest("testadmin", "wrongpassword");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void publicEndpoints_accessible_withoutAuth() throws Exception {
        mockMvc.perform(get("/api/projects")).andExpect(status().isOk());
        mockMvc.perform(get("/api/skills")).andExpect(status().isOk());
        mockMvc.perform(get("/api/certifications")).andExpect(status().isOk());
        mockMvc.perform(get("/api/education")).andExpect(status().isOk());
        mockMvc.perform(get("/api/experience")).andExpect(status().isOk());
    }

    @Test
    void adminStats_requiresAuth() throws Exception {
        mockMvc.perform(get("/api/admin/stats"))
            .andExpect(status().isForbidden());
    }

    @Test
    void adminStats_withValidToken_returns200() throws Exception {
        mockMvc.perform(get("/api/admin/stats")
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.totalProjects").isNumber());
    }

    @Test
    void contactSubmission_validRequest_returns200() throws Exception {
        String payload = """
            {
              "senderName": "Eleven",
              "senderEmail": "eleven@hawkins.lab",
              "subject": "TRANSMISSION",
              "message": "Friends don't lie. Mike."
            }
            """;
        mockMvc.perform(post("/api/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("MESSAGE_RECEIVED"));
    }

    @Test
    void jwtToken_isValid() {
        String token = jwtUtil.generateToken("testuser", "ROLE_USER");
        assert jwtUtil.isTokenValid(token);
        assert jwtUtil.extractUsername(token).equals("testuser");
        assert jwtUtil.extractRole(token).equals("ROLE_USER");
    }
}
