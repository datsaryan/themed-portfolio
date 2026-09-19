package com.aryansingh.portfolio.controller;

import com.aryansingh.portfolio.model.Certification;
import com.aryansingh.portfolio.service.CertificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/certifications")
public class CertificationController {

    private final CertificationService certificationService;

    public CertificationController(CertificationService certificationService) {
        this.certificationService = certificationService;
    }

    @GetMapping
    public ResponseEntity<List<Certification>> getCertifications() {
        return ResponseEntity.ok(certificationService.getAllCertifications());
    }
}
