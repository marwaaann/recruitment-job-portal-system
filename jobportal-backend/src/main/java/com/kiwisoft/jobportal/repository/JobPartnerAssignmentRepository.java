package com.kiwisoft.jobportal.repository;

import com.kiwisoft.jobportal.entity.JobPartnerAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobPartnerAssignmentRepository
        extends JpaRepository<JobPartnerAssignment, Long> {

    List<JobPartnerAssignment> findByPartnerId(Long partnerId);

    List<JobPartnerAssignment> findByJobId(Long jobId);

}