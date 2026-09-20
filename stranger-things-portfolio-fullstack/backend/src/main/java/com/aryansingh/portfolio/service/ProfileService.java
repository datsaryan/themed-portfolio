package com.aryansingh.portfolio.service;

import com.aryansingh.portfolio.exception.ResourceNotFoundException;
import com.aryansingh.portfolio.model.Profile;
import com.aryansingh.portfolio.repository.ProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {
    private final ProfileRepository repo;
    public ProfileService(ProfileRepository repo) { this.repo = repo; }

    public Profile getProfile() {
        return repo.findAll().stream().findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
    }
}
