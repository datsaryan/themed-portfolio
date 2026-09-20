package com.aryansingh.portfolio.model;

import jakarta.persistence.*;

@Entity
@Table(name = "education")
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String institution;
    private String degree;
    private String fieldOfStudy;
    private String cgpa;
    private int startYear;
    private int endYear;
    private boolean expected;

    @Column(columnDefinition = "TEXT")
    private String description;

    public Education() {}

    public Education(String institution, String degree, String fieldOfStudy, String cgpa,
                     int startYear, int endYear, boolean expected, String description) {
        this.institution = institution;
        this.degree = degree;
        this.fieldOfStudy = fieldOfStudy;
        this.cgpa = cgpa;
        this.startYear = startYear;
        this.endYear = endYear;
        this.expected = expected;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }
    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }
    public String getFieldOfStudy() { return fieldOfStudy; }
    public void setFieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; }
    public String getCgpa() { return cgpa; }
    public void setCgpa(String cgpa) { this.cgpa = cgpa; }
    public int getStartYear() { return startYear; }
    public void setStartYear(int startYear) { this.startYear = startYear; }
    public int getEndYear() { return endYear; }
    public void setEndYear(int endYear) { this.endYear = endYear; }
    public boolean isExpected() { return expected; }
    public void setExpected(boolean expected) { this.expected = expected; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
