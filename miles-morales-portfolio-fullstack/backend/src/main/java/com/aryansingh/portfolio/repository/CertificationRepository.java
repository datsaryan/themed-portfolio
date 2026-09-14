package com.aryansingh.portfolio.repository;

import com.aryansingh.portfolio.model.Certification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findAllByOrderByDisplayOrderAsc();
}
