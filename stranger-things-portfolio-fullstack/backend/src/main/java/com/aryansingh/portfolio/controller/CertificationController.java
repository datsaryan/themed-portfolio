package com.aryansingh.portfolio.controller;

import com.aryansingh.portfolio.model.Certification;
import com.aryansingh.portfolio.service.CertificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/certifications")
public class CertificationController {
    private final CertificationService service;
    public CertificationController(CertificationService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<List<Certification>> getAll() { return ResponseEntity.ok(service.getAll()); }
}
