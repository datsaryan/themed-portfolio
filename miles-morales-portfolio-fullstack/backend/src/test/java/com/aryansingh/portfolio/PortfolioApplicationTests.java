package com.aryansingh.portfolio;

import com.aryansingh.portfolio.dto.AuthRequest;
import com.aryansingh.portfolio.dto.ContactRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class PortfolioApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetProfile() throws Exception {
        mockMvc.perform(get("/api/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Aryan Singh")))
                .andExpect(jsonPath("$.title", containsString("Full Stack Engineer")))
                .andExpect(jsonPath("$.institution", containsString("OP Jindal University")));
    }

    @Test
    void testGetProjects() throws Exception {
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(4))))
                .andExpect(jsonPath("$[0].title", is("HireTrack")));
    }

    @Test
    void testGetSkills() throws Exception {
        mockMvc.perform(get("/api/skills"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(5))))
                .andExpect(jsonPath("$[0].category", is("Languages")));
    }

    @Test
    void testPostContactMessage() throws Exception {
        ContactRequest contactRequest = new ContactRequest();
        contactRequest.setName("Mike Wheeler");
        contactRequest.setEmail("mike@hawkins.net");
        contactRequest.setMessage("Testing the Hawkins radio transmission endpoint.");

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(contactRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()));
    }

    @Test
    void testAuthAndProtectedAdminEndpoint() throws Exception {
        // 1. Admin login
        AuthRequest loginRequest = new AuthRequest("admin", "HawkinsLab1986!");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andReturn();

        JsonNode json = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String token = json.get("token").asText();

        // 2. Access protected endpoint WITHOUT token -> Should fail
        mockMvc.perform(get("/api/admin/messages"))
                .andExpect(status().isForbidden());

        // 3. Access protected endpoint WITH valid JWT token -> Should succeed
        mockMvc.perform(get("/api/admin/messages")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", notNullValue()));

        // 4. Access admin stats WITH valid JWT token
        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalProjects", greaterThan(0)));
    }
}
