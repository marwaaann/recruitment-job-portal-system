package com.kiwisoft.jobportal.service;

import com.kiwisoft.jobportal.dto.request.JobApplicationRequest;
import com.kiwisoft.jobportal.dto.request.UpdateApplicationStatusRequest;
import com.kiwisoft.jobportal.dto.response.JobApplicationResponse;

import java.util.List;

public interface JobApplicationService {

    // Apply for a Job
    JobApplicationResponse applyJob(
            Long jobId,
            Long partnerId,
            JobApplicationRequest request
    );

    // Get all applications of a Job
    List<JobApplicationResponse> getApplicationsByJob(
            Long jobId
    );

    // Get all applications of a Candidate
    List<JobApplicationResponse> getApplicationsByCandidate(
            Long candidateId
    );

    // Get all applications created by a Partner
    List<JobApplicationResponse> getApplicationsByPartner(
            Long partnerId
    );

    // Get a single application
    JobApplicationResponse getApplicationById(
            Long applicationId
    );

    // Update Application Status
    JobApplicationResponse updateApplicationStatus(
            Long applicationId,
            UpdateApplicationStatusRequest request
    );

}