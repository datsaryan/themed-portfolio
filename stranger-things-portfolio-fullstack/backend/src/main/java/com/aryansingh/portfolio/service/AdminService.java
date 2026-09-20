package com.aryansingh.portfolio.service;

import com.aryansingh.portfolio.dto.AdminStatsResponse;
import com.aryansingh.portfolio.repository.*;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    private final ProjectRepository projectRepo;
    private final SkillCategoryRepository skillRepo;
    private final CertificationRepository certRepo;
    private final ContactMessageRepository contactRepo;

    public AdminService(ProjectRepository projectRepo, SkillCategoryRepository skillRepo,
                        CertificationRepository certRepo, ContactMessageRepository contactRepo) {
        this.projectRepo = projectRepo;
        this.skillRepo = skillRepo;
        this.certRepo = certRepo;
        this.contactRepo = contactRepo;
    }

    public AdminStatsResponse getStats() {
        return new AdminStatsResponse(
            projectRepo.count(),
            skillRepo.count(),
            certRepo.count(),
            contactRepo.count(),
            contactRepo.countByIsReadFalse()
        );
    }
}
