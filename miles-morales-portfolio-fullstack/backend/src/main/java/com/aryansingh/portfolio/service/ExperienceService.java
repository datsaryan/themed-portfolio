package com.aryansingh.portfolio.service;

import com.aryansingh.portfolio.model.Experience;
import com.aryansingh.portfolio.repository.ExperienceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExperienceService {

    private final ExperienceRepository experienceRepository;

    public ExperienceService(ExperienceRepository experienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    @Transactional(readOnly = true)
    public List<Experience> getAllExperience() {
        return experienceRepository.findAllByOrderByDisplayOrderAsc();
    }
}
