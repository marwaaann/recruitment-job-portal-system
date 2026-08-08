package com.kiwisoft.jobportal.impl;

import com.kiwisoft.jobportal.dto.request.JobApplicationRequest;
import com.kiwisoft.jobportal.dto.request.UpdateApplicationStatusRequest;
import com.kiwisoft.jobportal.dto.response.JobApplicationResponse;
import com.kiwisoft.jobportal.entity.Job;
import com.kiwisoft.jobportal.entity.JobApplication;
import com.kiwisoft.jobportal.enums.ApplicationStatus;
import com.kiwisoft.jobportal.exception.BadRequestException;
import com.kiwisoft.jobportal.exception.ResourceNotFoundException;
import com.kiwisoft.jobportal.repository.JobApplicationRepository;
import com.kiwisoft.jobportal.repository.JobRepository;
import com.kiwisoft.jobportal.repository.UserRepository;
import com.kiwisoft.jobportal.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobApplicationServiceImpl implements JobApplicationService {

    private final JobRepository jobRepository;

    private final JobApplicationRepository jobApplicationRepository;

    private final UserRepository userRepository;

    @Override
    public JobApplicationResponse applyJob(
            Long jobId,
            Long partnerId,
            JobApplicationRequest request
    ) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Job Not Found"));

        if (jobApplicationRepository.existsByCandidateIdAndJobId(
                request.getCandidateId(),
                jobId
        )) {
            throw new BadRequestException(
                    "Candidate has already applied for this job."
            );
        }

        JobApplication application = new JobApplication();

        application.setJobId(job.getId());
        application.setPartnerId(partnerId);
        application.setCandidateName(request.getCandidateName());

        application.setCandidateId(request.getCandidateId());
        application.setEmail(request.getEmail());
        application.setPhone(request.getPhone());
        application.setExperience(request.getExperience());
        application.setResumeUrl(request.getResumeUrl());

        application.setStatus(ApplicationStatus.APPLIED);

        application.setCreatedBy(partnerId);

        JobApplication saved =
                jobApplicationRepository.save(application);

        return mapToResponse(saved);

    }

    @Override
    public List<JobApplicationResponse> getApplicationsByJob(Long jobId) {

        return jobApplicationRepository.findByJobId(jobId)
                .stream()
                .map(this::mapToResponse)
                .toList();

    }

    @Override
    public JobApplicationResponse getApplicationById(Long applicationId) {

        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Application not found"));

        return mapToResponse(application);

    }

    @Override
    public List<JobApplicationResponse> getApplicationsByPartner(Long partnerId) {

        return jobApplicationRepository.findByPartnerId(partnerId)
                .stream()
                .map(this::mapToResponse)
                .toList();

    }

    @Override
    public List<JobApplicationResponse> getApplicationsByCandidate(Long candidateId) {

        return jobApplicationRepository.findByCandidateId(candidateId)
                .stream()
                .map(this::mapToResponse)
                .toList();

    }

    @Override
    public JobApplicationResponse updateApplicationStatus(
            Long applicationId,
            UpdateApplicationStatusRequest request) {

        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Application not found"));

        application.setStatus(request.getStatus());

        JobApplication updatedApplication =
                jobApplicationRepository.save(application);

        return mapToResponse(updatedApplication);
    }

    private JobApplicationResponse mapToResponse(JobApplication application) {

        return JobApplicationResponse.builder()
                .id(application.getId())
                .jobId(application.getJobId())
                .partnerId(application.getPartnerId())
                .candidateName(application.getCandidateName())
                .candidateId(application.getCandidateId())
                .email(application.getEmail())
                .phone(application.getPhone())
                .experience(application.getExperience())
                .resumeUrl(application.getResumeUrl())
                .status(application.getStatus())
                .createdBy(application.getCreatedBy())
                .createdAt(application.getCreatedAt())
                .build();

    }

}