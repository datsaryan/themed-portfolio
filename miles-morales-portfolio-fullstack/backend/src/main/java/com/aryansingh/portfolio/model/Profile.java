package com.aryansingh.portfolio.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Single-row table holding the "personal" + "education" content that used to
 * live as hardcoded object literals in the frontend's resumeData.ts.
 */
@Entity
@Table(name = "profile")
public class Profile {

    @Id
    private Integer id;

    private String name;

    @Column(name = "hero_codename")
    private String heroCodename;

    private String title;

    private String tagline;

    private String phone;

    private String email;

    private String location;

    private String status;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "leetcode_url")
    private String leetcodeUrl;

    @Column(name = "resume_pdf_path")
    private String resumePdfPath;

    @Column(columnDefinition = "TEXT")
    private String summary;

    private String institution;

    private String degree;

    private String cgpa;

    private String timeline;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "profile_coursework", joinColumns = @JoinColumn(name = "profile_id"))
    @OrderColumn(name = "list_index")
    @Column(name = "coursework", length = 200)
    private List<String> relevantCoursework = new ArrayList<>();

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getHeroCodename() { return heroCodename; }
    public void setHeroCodename(String heroCodename) { this.heroCodename = heroCodename; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getLeetcodeUrl() { return leetcodeUrl; }
    public void setLeetcodeUrl(String leetcodeUrl) { this.leetcodeUrl = leetcodeUrl; }

    public String getResumePdfPath() { return resumePdfPath; }
    public void setResumePdfPath(String resumePdfPath) { this.resumePdfPath = resumePdfPath; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getCgpa() { return cgpa; }
    public void setCgpa(String cgpa) { this.cgpa = cgpa; }

    public String getTimeline() { return timeline; }
    public void setTimeline(String timeline) { this.timeline = timeline; }

    public List<String> getRelevantCoursework() { return relevantCoursework; }
    public void setRelevantCoursework(List<String> relevantCoursework) { this.relevantCoursework = relevantCoursework; }
}
