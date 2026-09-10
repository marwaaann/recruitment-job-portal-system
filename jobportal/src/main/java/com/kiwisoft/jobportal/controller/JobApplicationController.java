package com.kiwisoft.jobportal.controller;

import com.kiwisoft.jobportal.dto.request.JobApplicationRequest;
import com.kiwisoft.jobportal.dto.request.UpdateApplicationStatusRequest;
import com.kiwisoft.jobportal.dto.response.JobApplicationResponse;
import com.kiwisoft.jobportal.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @PostMapping("/{jobId}/applications")
    public JobApplicationResponse applyJob(
            @PathVariable Long jobId,
            @RequestParam(required = false) Long partnerId,
            @RequestBody JobApplicationRequest request
    ) {

        return jobApplicationService.applyJob(
                jobId,
                partnerId,
                request
        );
    }

    @GetMapping("/{jobId}/applications")
    public List<JobApplicationResponse> getApplications(
            @PathVariable Long jobId
    ) {

        return jobApplicationService.getApplicationsByJob(jobId);

    }


    @GetMapping("/applications/{applicationId}")
    public ResponseEntity<JobApplicationResponse> getApplicationById(
            @PathVariable Long applicationId
    ) {

        return ResponseEntity.ok(
                jobApplicationService.getApplicationById(applicationId)
        );

    }

    @GetMapping("/candidate/{candidateId}/applications")
    public ResponseEntity<List<JobApplicationResponse>> getApplicationsByCandidate(
            @PathVariable Long candidateId
    ) {

        return ResponseEntity.ok(
                jobApplicationService.getApplicationsByCandidate(candidateId)
        );

    }

    @GetMapping("/partner/{partnerId}/applications")
    public ResponseEntity<List<JobApplicationResponse>> getApplicationsByPartner(
            @PathVariable Long partnerId
    ) {

        return ResponseEntity.ok(
                jobApplicationService.getApplicationsByPartner(partnerId)
        );

    }

    @PutMapping("/applications/{applicationId}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','CLIENT')")
    public ResponseEntity<JobApplicationResponse> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestBody UpdateApplicationStatusRequest request) {

        return ResponseEntity.ok(
                jobApplicationService.updateApplicationStatus(applicationId, request)
        );
    }

}