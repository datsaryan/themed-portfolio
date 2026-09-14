package com.aryansingh.portfolio.repository;

import com.aryansingh.portfolio.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, String> {
    List<Project> findAllByOrderByDisplayOrderAsc();
}
