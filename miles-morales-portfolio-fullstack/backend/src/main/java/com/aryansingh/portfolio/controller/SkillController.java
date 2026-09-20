package com.aryansingh.portfolio.controller;

import com.aryansingh.portfolio.model.SkillCategory;
import com.aryansingh.portfolio.repository.SkillCategoryRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillCategoryRepository skillCategoryRepository;

    public SkillController(SkillCategoryRepository skillCategoryRepository) {
        this.skillCategoryRepository = skillCategoryRepository;
    }

    @GetMapping
    public List<SkillCategory> getAllSkillCategories() {
        return skillCategoryRepository.findAllByOrderByDisplayOrderAsc();
    }
}
