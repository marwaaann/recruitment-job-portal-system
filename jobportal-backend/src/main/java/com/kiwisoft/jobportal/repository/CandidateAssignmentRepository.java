package com.kiwisoft.jobportal.repository;

import com.kiwisoft.jobportal.entity.CandidateAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidateAssignmentRepository
        extends JpaRepository<CandidateAssignment, Long> {

    List<CandidateAssignment> findByCandidateId(Long candidateId);

}