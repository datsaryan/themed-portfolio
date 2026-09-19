package com.aryansingh.portfolio.controller;

import com.aryansingh.portfolio.exception.ResourceNotFoundException;
import com.aryansingh.portfolio.model.Profile;
import com.aryansingh.portfolio.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<Profile> getProfile() {
        Profile profile = profileService.getProfile()
                .orElseThrow(() -> new ResourceNotFoundException("Profile record not found"));
        return ResponseEntity.ok(profile);
    }
}
