package com.aryansingh.portfolio.controller;

import com.aryansingh.portfolio.model.Education;
import com.aryansingh.portfolio.service.EducationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/education")
public class EducationController {
    private final EducationService service;
    public EducationController(EducationService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<List<Education>> getAll() { return ResponseEntity.ok(service.getAll()); }
}
