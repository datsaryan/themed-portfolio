package com.aryansingh.portfolio.service;

import com.aryansingh.portfolio.dto.AdminStatsResponse;
import com.aryansingh.portfolio.model.ContactMessage;
import com.aryansingh.portfolio.repository.CertificationRepository;
import com.aryansingh.portfolio.repository.ContactMessageRepository;
import com.aryansingh.portfolio.repository.ProjectRepository;
import com.aryansingh.portfolio.repository.SkillCategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final ContactMessageRepository contactMessageRepository;
    private final ProjectRepository projectRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final CertificationRepository certificationRepository;

    public AdminService(ContactMessageRepository contactMessageRepository,
                        ProjectRepository projectRepository,
                        SkillCategoryRepository skillCategoryRepository,
                        CertificationRepository certificationRepository) {
        this.contactMessageRepository = contactMessageRepository;
        this.projectRepository = projectRepository;
        this.skillCategoryRepository = skillCategoryRepository;
        this.certificationRepository = certificationRepository;
    }

    @Transactional(readOnly = true)
    public List<ContactMessage> getAllTransmissions() {
        return contactMessageRepository.findAll();
    }

    @Transactional(readOnly = true)
    public AdminStatsResponse getStats() {
        long messages = contactMessageRepository.count();
        long projects = projectRepository.count();
        long skills = skillCategoryRepository.count();
        long certs = certificationRepository.count();

        return new AdminStatsResponse(
                messages,
                projects,
                skills,
                certs,
                "ONLINE // HAWKINS TELEMETRY OPERATIONAL",
                "PostgreSQL / SQL JPA",
                "Production / Cloud-Ready"
        );
    }
}
