package com.aryansingh.portfolio.dto;

public class AdminStatsResponse {

    private long totalMessages;
    private long totalProjects;
    private long totalSkills;
    private long totalCertifications;
    private String systemStatus;
    private String databaseEngine;
    private String environment;

    public AdminStatsResponse() {}

    public AdminStatsResponse(long totalMessages, long totalProjects, long totalSkills, long totalCertifications, String systemStatus, String databaseEngine, String environment) {
        this.totalMessages = totalMessages;
        this.totalProjects = totalProjects;
        this.totalSkills = totalSkills;
        this.totalCertifications = totalCertifications;
        this.systemStatus = systemStatus;
        this.databaseEngine = databaseEngine;
        this.environment = environment;
    }

    public long getTotalMessages() { return totalMessages; }
    public void setTotalMessages(long totalMessages) { this.totalMessages = totalMessages; }

    public long getTotalProjects() { return totalProjects; }
    public void setTotalProjects(long totalProjects) { this.totalProjects = totalProjects; }

    public long getTotalSkills() { return totalSkills; }
    public void setTotalSkills(long totalSkills) { this.totalSkills = totalSkills; }

    public long getTotalCertifications() { return totalCertifications; }
    public void setTotalCertifications(long totalCertifications) { this.totalCertifications = totalCertifications; }

    public String getSystemStatus() { return systemStatus; }
    public void setSystemStatus(String systemStatus) { this.systemStatus = systemStatus; }

    public String getDatabaseEngine() { return databaseEngine; }
    public void setDatabaseEngine(String databaseEngine) { this.databaseEngine = databaseEngine; }

    public String getEnvironment() { return environment; }
    public void setEnvironment(String environment) { this.environment = environment; }
}
