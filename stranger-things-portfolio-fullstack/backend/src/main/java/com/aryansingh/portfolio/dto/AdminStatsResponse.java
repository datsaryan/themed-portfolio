package com.aryansingh.portfolio.dto;

public record AdminStatsResponse(
    long totalProjects,
    long totalSkillCategories,
    long totalCertifications,
    long totalMessages,
    long unreadMessages
) {}
