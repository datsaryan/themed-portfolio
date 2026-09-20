package com.aryansingh.portfolio.service;

import com.aryansingh.portfolio.exception.ResourceNotFoundException;
import com.aryansingh.portfolio.model.Project;
import com.aryansingh.portfolio.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProjectService {
    private final ProjectRepository repo;
    public ProjectService(ProjectRepository repo) { this.repo = repo; }

    public List<Project> getAllProjects() { return repo.findAllByOrderByDisplayOrderAsc(); }

    public Project getById(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));
    }
}
