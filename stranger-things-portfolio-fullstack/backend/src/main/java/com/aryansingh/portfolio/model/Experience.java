package com.aryansingh.portfolio.model;

import jakarta.persistence.*;

@Entity
@Table(name = "experience")
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String organization;
    private String role;
    private String startDate;
    private String endDate;
    private boolean isCurrent;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "skills_used")
    private String skillsUsed;

    public Experience() {}

    public Experience(String organization, String role, String startDate, String endDate,
                      boolean isCurrent, String description, String skillsUsed) {
        this.organization = organization;
        this.role = role;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isCurrent = isCurrent;
        this.description = description;
        this.skillsUsed = skillsUsed;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getOrganization() { return organization; }
    public void setOrganization(String organization) { this.organization = organization; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    public boolean isCurrent() { return isCurrent; }
    public void setCurrent(boolean current) { isCurrent = current; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSkillsUsed() { return skillsUsed; }
    public void setSkillsUsed(String skillsUsed) { this.skillsUsed = skillsUsed; }
}
