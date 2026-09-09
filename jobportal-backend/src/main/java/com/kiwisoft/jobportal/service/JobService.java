package com.kiwisoft.jobportal.service;

import com.kiwisoft.jobportal.dto.request.AssignPartnerRequest;
import com.kiwisoft.jobportal.dto.request.JobRequest;
import com.kiwisoft.jobportal.dto.request.UpdateJobRequest;
import com.kiwisoft.jobportal.dto.response.JobResponse;

import java.util.List;

public interface JobService {

    JobResponse createJob(JobRequest request);

    List<JobResponse> getAllJobs();

    JobResponse getJobById(Long id);

    JobResponse updateJob(
            Long id,
            UpdateJobRequest request
    );

    JobResponse closeJob(Long id);

    String assignPartner(
            Long jobId,
            AssignPartnerRequest request
    );

    List<JobResponse> getJobsForPartner(
            Long partnerId
    );

}