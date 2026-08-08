package com.kiwisoft.jobportal.repository;

import com.kiwisoft.jobportal.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByJobId(Long jobId);

    List<JobApplication> findByPartnerId(Long partnerId);

    List<JobApplication> findByCandidateId(Long candidateId);

    boolean existsByCandidateIdAndJobId(Long candidateId,
                                        Long jobId);


}