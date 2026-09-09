package com.kiwisoft.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {



    @Id
    private Long candidateId;

    @MapsId
    @OneToOne
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;

    @Column(columnDefinition = "TEXT")
    private String experience;

    @Column(columnDefinition = "TEXT")
    private String education;

    @Column(columnDefinition = "TEXT")
    private String customFields;

    private LocalDateTime lastIndexedAt;

}