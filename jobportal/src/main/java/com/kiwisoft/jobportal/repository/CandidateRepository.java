package com.kiwisoft.jobportal.repository;

import com.kiwisoft.jobportal.entity.Candidate;
import com.kiwisoft.jobportal.enums.CandidateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface CandidateRepository
        extends JpaRepository<Candidate, Long> {

    Optional<Candidate> findByEmail(String email);

    Optional<Candidate> findByPhoneNormalized(String phoneNormalized);

    Optional<Candidate> findByPassportNumber(String passportNumber);

    @Query("""
        SELECT c
        FROM Candidate c
        WHERE
            LOWER(c.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(c.phoneNormalized) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(c.passportNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))
        
        """)
    List<Candidate> searchCandidates(@Param("keyword") String keyword);

    Page<Candidate> findByCanonicalStatus(
            CandidateStatus status,
            Pageable pageable
    );

    @Query("""
SELECT c
FROM Candidate c
WHERE
c.canonicalStatus='ACTIVE'
AND
(
LOWER(c.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
OR LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
OR LOWER(c.phoneNormalized) LIKE LOWER(CONCAT('%', :keyword, '%'))
OR LOWER(c.passportNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))
)

""")
    Page<Candidate> searchCandidates(
            @Param("keyword") String keyword,
            Pageable pageable
    );

}