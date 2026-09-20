package com.aryansingh.portfolio.controller;

import com.aryansingh.portfolio.model.Profile;
import com.aryansingh.portfolio.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final ProfileService service;
    public ProfileController(ProfileService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<Profile> getProfile() {
        return ResponseEntity.ok(service.getProfile());
    }
}
