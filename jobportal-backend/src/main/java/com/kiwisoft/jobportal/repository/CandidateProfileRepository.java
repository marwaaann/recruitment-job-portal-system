package com.kiwisoft.jobportal.repository;

import com.kiwisoft.jobportal.entity.Candidate;
import com.kiwisoft.jobportal.entity.CandidateProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CandidateProfileRepository
        extends JpaRepository<CandidateProfile, Long> {

    Optional<CandidateProfile> findByCandidate(Candidate candidate);

}