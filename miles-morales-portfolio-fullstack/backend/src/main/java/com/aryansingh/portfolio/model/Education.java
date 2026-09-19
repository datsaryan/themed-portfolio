package com.aryansingh.portfolio.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "education")
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String institution;

    @Column(nullable = false)
    private String degree;

    private String cgpa;

    private String timeline;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "education_coursework", joinColumns = @JoinColumn(name = "education_id"))
    @OrderColumn(name = "list_index")
    @Column(name = "coursework")
    private List<String> relevantCoursework = new ArrayList<>();

    public Education() {}

    public Education(String institution, String degree, String cgpa, String timeline, List<String> coursework) {
        this.institution = institution;
        this.degree = degree;
        this.cgpa = cgpa;
        this.timeline = timeline;
        this.relevantCoursework = coursework != null ? coursework : new ArrayList<>();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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
