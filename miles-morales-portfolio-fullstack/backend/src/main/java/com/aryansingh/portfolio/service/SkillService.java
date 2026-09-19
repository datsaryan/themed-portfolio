package com.aryansingh.portfolio.service;

import com.aryansingh.portfolio.model.SkillCategory;
import com.aryansingh.portfolio.repository.SkillCategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SkillService {

    private final SkillCategoryRepository skillCategoryRepository;

    public SkillService(SkillCategoryRepository skillCategoryRepository) {
        this.skillCategoryRepository = skillCategoryRepository;
    }

    @Transactional(readOnly = true)
    public List<SkillCategory> getAllSkillCategories() {
        return skillCategoryRepository.findAllByOrderByDisplayOrderAsc();
    }
}
