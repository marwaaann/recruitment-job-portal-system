package com.kiwisoft.jobportal.controller;

import com.kiwisoft.jobportal.dto.request.AssignPartnerRequest;
import com.kiwisoft.jobportal.dto.request.JobRequest;
import com.kiwisoft.jobportal.dto.request.UpdateJobRequest;
import com.kiwisoft.jobportal.dto.response.JobResponse;
import com.kiwisoft.jobportal.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // Create Job
    @PostMapping
    public JobResponse createJob(
            @RequestBody JobRequest request
    ) {
        return jobService.createJob(request);
    }

    // Get All Jobs
    @GetMapping
    public List<JobResponse> getAllJobs() {
        return jobService.getAllJobs();
    }

    // Get Job By Id
    @GetMapping("/{id}")
    public JobResponse getJobById(
            @PathVariable Long id
    ) {
        return jobService.getJobById(id);
    }

    // Update Job
    @PutMapping("/{id}")
    public JobResponse updateJob(
            @PathVariable Long id,
            @RequestBody UpdateJobRequest request
    ) {
        return jobService.updateJob(id, request);
    }

    // Close Job
    @PostMapping("/{id}/close")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<JobResponse> closeJob(
            @PathVariable Long id) {

        return ResponseEntity.ok(jobService.closeJob(id));
    }

    // Assign Partner
    @PostMapping("/{id}/assign-partner")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public String assignPartner(
            @PathVariable Long id,
            @RequestBody AssignPartnerRequest request
    ) {

        System.out.println("INSIDE ASSIGN PARTNER");

        return jobService.assignPartner(id, request);
    }

    // Jobs for Partner
    @GetMapping("/partner/{partnerId}")
    public List<JobResponse> getJobsForPartner(
            @PathVariable Long partnerId
    ) {
        return jobService.getJobsForPartner(partnerId);
    }

}