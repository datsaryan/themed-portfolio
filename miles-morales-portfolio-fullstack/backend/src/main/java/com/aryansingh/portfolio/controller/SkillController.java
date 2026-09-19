package com.aryansingh.portfolio.controller;

import com.aryansingh.portfolio.model.SkillCategory;
import com.aryansingh.portfolio.service.SkillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public ResponseEntity<List<SkillCategory>> getSkills() {
        return ResponseEntity.ok(skillService.getAllSkillCategories());
    }
}
