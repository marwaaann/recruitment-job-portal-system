package com.kiwisoft.jobportal.entity;

import com.kiwisoft.jobportal.enums.CandidateStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String passportNumber;

    private String passportHash;

    private String phoneNormalized;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String fullName;

    private LocalDate dob;

    private String nationality;

    private Long createdByUserId;

    private Long createdByPartnerId;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CandidateStatus canonicalStatus = CandidateStatus.ACTIVE;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

}