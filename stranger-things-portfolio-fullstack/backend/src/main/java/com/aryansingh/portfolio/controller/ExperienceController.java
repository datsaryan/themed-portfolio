package com.aryansingh.portfolio.controller;

import com.aryansingh.portfolio.model.Experience;
import com.aryansingh.portfolio.service.ExperienceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/experience")
public class ExperienceController {
    private final ExperienceService service;
    public ExperienceController(ExperienceService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<List<Experience>> getAll() { return ResponseEntity.ok(service.getAll()); }
}
