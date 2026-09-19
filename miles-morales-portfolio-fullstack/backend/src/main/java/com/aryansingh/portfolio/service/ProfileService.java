package com.aryansingh.portfolio.service;

import com.aryansingh.portfolio.model.Profile;
import com.aryansingh.portfolio.repository.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public Optional<Profile> getProfile() {
        return profileRepository.findById(1);
    }
}
