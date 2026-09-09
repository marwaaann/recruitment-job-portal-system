package com.kiwisoft.jobportal.repository;

import com.kiwisoft.jobportal.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {

}