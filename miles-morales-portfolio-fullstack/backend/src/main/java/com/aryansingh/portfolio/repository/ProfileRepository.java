package com.aryansingh.portfolio.repository;

import com.aryansingh.portfolio.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, Integer> {
}
