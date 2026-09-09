package com.kiwisoft.jobportal.repository;

import com.kiwisoft.jobportal.entity.Partner;
import com.kiwisoft.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface PartnerRepository
        extends JpaRepository<Partner, Long> {

    @Query("""
SELECT p
FROM Partner p
WHERE

LOWER(p.companyName) LIKE LOWER(CONCAT('%', :keyword, '%'))

OR LOWER(p.contactPerson) LIKE LOWER(CONCAT('%', :keyword, '%'))

OR LOWER(p.email) LIKE LOWER(CONCAT('%', :keyword, '%'))

OR LOWER(p.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))

""")
    Page<Partner> searchPartners(
            @Param("keyword") String keyword,
            Pageable pageable
    );

    Optional<Partner> findByEmail(String email);

    Optional<Partner> findByUser(User user);

}