package com.aryansingh.portfolio.service;

import com.aryansingh.portfolio.model.Education;
import com.aryansingh.portfolio.repository.EducationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EducationService {

    private final EducationRepository educationRepository;

    public EducationService(EducationRepository educationRepository) {
        this.educationRepository = educationRepository;
    }

    @Transactional(readOnly = true)
    public List<Education> getAllEducation() {
        return educationRepository.findAll();
    }
}
