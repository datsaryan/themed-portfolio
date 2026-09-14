package com.aryansingh.portfolio.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/** Mirrors the ProjectItem shape the frontend already expects. */
@Entity
@Table(name = "projects")
public class Project {

    @Id
    private String id;

    @Column(name = "mission_number", nullable = false)
    private String missionNumber;

    @Column(nullable = false)
    private String title;

    private String subtitle;

    private String dates;

    private String sector;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "live_url")
    private String liveUrl;

    @Column(name = "accent_color")
    private String accentColor;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_tech_stack", joinColumns = @JoinColumn(name = "project_id"))
    @OrderColumn(name = "list_index")
    @Column(name = "tech", length = 100)
    private List<String> techStack = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_bullets", joinColumns = @JoinColumn(name = "project_id"))
    @OrderColumn(name = "list_index")
    @Column(name = "bullet", columnDefinition = "TEXT")
    private List<String> bullets = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_metrics", joinColumns = @JoinColumn(name = "project_id"))
    @OrderColumn(name = "list_index")
    @Column(name = "metric", length = 200)
    private List<String> metrics = new ArrayList<>();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMissionNumber() { return missionNumber; }
    public void setMissionNumber(String missionNumber) { this.missionNumber = missionNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public String getDates() { return dates; }
    public void setDates(String dates) { this.dates = dates; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLiveUrl() { return liveUrl; }
    public void setLiveUrl(String liveUrl) { this.liveUrl = liveUrl; }

    public String getAccentColor() { return accentColor; }
    public void setAccentColor(String accentColor) { this.accentColor = accentColor; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public List<String> getTechStack() { return techStack; }
    public void setTechStack(List<String> techStack) { this.techStack = techStack; }

    public List<String> getBullets() { return bullets; }
    public void setBullets(List<String> bullets) { this.bullets = bullets; }

    public List<String> getMetrics() { return metrics; }
    public void setMetrics(List<String> metrics) { this.metrics = metrics; }
}
