package com.aryansingh.portfolio.service;

import com.aryansingh.portfolio.model.SkillCategory;
import com.aryansingh.portfolio.repository.SkillCategoryRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SkillService {
    private final SkillCategoryRepository repo;
    public SkillService(SkillCategoryRepository repo) { this.repo = repo; }

    public List<SkillCategory> getAllCategories() { return repo.findAllByOrderByDisplayOrderAsc(); }
}
