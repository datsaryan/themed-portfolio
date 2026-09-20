package com.aryansingh.portfolio.controller;

import com.aryansingh.portfolio.model.Project;
import com.aryansingh.portfolio.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService service;
    public ProjectController(ProjectService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<List<Project>> getAll() { return ResponseEntity.ok(service.getAllProjects()); }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getById(@PathVariable Long id) { return ResponseEntity.ok(service.getById(id)); }
}
