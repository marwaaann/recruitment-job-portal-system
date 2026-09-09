package com.kiwisoft.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_partner_assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPartnerAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long jobId;

    @Column(nullable = false)
    private Long partnerId;

    @Column(nullable = false)
    private Long assignedBy;

    @Builder.Default
    private LocalDateTime assignedAt = LocalDateTime.now();

}