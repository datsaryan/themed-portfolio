package com.aryansingh.portfolio.service;

import com.aryansingh.portfolio.model.Certification;
import com.aryansingh.portfolio.repository.CertificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CertificationService {

    private final CertificationRepository certificationRepository;

    public CertificationService(CertificationRepository certificationRepository) {
        this.certificationRepository = certificationRepository;
    }

    @Transactional(readOnly = true)
    public List<Certification> getAllCertifications() {
        return certificationRepository.findAllByOrderByDisplayOrderAsc();
    }
}
