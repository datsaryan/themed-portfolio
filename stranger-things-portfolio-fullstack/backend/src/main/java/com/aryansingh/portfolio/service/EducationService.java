package com.aryansingh.portfolio.service;

import com.aryansingh.portfolio.model.Education;
import com.aryansingh.portfolio.repository.EducationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EducationService {
    private final EducationRepository repo;
    public EducationService(EducationRepository repo) { this.repo = repo; }

    public List<Education> getAll() { return repo.findAll(); }
}
