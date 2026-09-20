package com.aryansingh.portfolio.service;

import com.aryansingh.portfolio.model.Certification;
import com.aryansingh.portfolio.repository.CertificationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CertificationService {
    private final CertificationRepository repo;
    public CertificationService(CertificationRepository repo) { this.repo = repo; }

    public List<Certification> getAll() { return repo.findAll(); }
}
