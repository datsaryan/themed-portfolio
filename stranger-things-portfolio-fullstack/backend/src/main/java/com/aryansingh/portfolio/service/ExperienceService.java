package com.aryansingh.portfolio.service;

import com.aryansingh.portfolio.model.Experience;
import com.aryansingh.portfolio.repository.ExperienceRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ExperienceService {
    private final ExperienceRepository repo;
    public ExperienceService(ExperienceRepository repo) { this.repo = repo; }

    public List<Experience> getAll() { return repo.findAll(); }
}
