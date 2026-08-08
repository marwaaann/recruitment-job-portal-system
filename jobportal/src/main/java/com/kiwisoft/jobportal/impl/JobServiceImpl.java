package com.kiwisoft.jobportal.impl;

import com.kiwisoft.jobportal.dto.request.AssignPartnerRequest;
import com.kiwisoft.jobportal.dto.request.JobRequest;
import com.kiwisoft.jobportal.dto.request.UpdateJobRequest;
import com.kiwisoft.jobportal.dto.response.JobResponse;
import com.kiwisoft.jobportal.entity.Client;
import com.kiwisoft.jobportal.entity.Job;
import com.kiwisoft.jobportal.entity.JobPartnerAssignment;
import com.kiwisoft.jobportal.entity.User;
import com.kiwisoft.jobportal.enums.JobStatus;
import com.kiwisoft.jobportal.exception.BadRequestException;
import com.kiwisoft.jobportal.exception.ResourceNotFoundException;
import com.kiwisoft.jobportal.repository.ClientRepository;
import com.kiwisoft.jobportal.repository.JobPartnerAssignmentRepository;
import com.kiwisoft.jobportal.repository.JobRepository;
import com.kiwisoft.jobportal.repository.PartnerRepository;
import com.kiwisoft.jobportal.repository.UserRepository;
import com.kiwisoft.jobportal.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;

    private final ClientRepository clientRepository;

    private final PartnerRepository partnerRepository;

    private final JobPartnerAssignmentRepository assignmentRepository;

    private final UserRepository userRepository;



    @Override
    public JobResponse createJob(
            JobRequest request
    ) {

        Client client =
                clientRepository
                        .findById(request.getClientId())
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Client not found"
                                )
                        );

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("User not found"));

        Job job = Job.builder()
                .clientId(client.getId())
                .title(request.getTitle())
                .description(request.getDescription())
                .vacancyCount(request.getVacancyCount())
                .status(JobStatus.OPEN)
                .createdBy(user.getId())
                .build();


        Job savedJob = jobRepository.save(job);

        return mapToResponse(savedJob);

    }

    @Override
    public List<JobResponse> getAllJobs() {

        return jobRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();

    }

    @Override
    public JobResponse getJobById(
            Long id
    ) {

        Job job =
                jobRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Job Not Found"
                                )
                        );

        return mapToResponse(job);

    }


    @Override
    public JobResponse updateJob(
            Long id,
            UpdateJobRequest request
    ) {

        Job job =
                jobRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Job Not Found"
                                )
                        );

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setVacancyCount(request.getVacancyCount());

        Job updatedJob = jobRepository.save(job);

        return mapToResponse(updatedJob);

    }


    @Override
    public JobResponse closeJob(
            Long id
    ) {

        Job job =
                jobRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Job Not Found"
                                )
                        );

        job.setStatus(JobStatus.CLOSED);

        Job updatedJob = jobRepository.save(job);

        return mapToResponse(updatedJob);

    }


    @Override
    public String assignPartner(
            Long jobId,
            AssignPartnerRequest request
    ) {

        Job job =
                jobRepository
                        .findById(jobId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Job Not Found"
                                )
                        );

        partnerRepository
                .findById(request.getPartnerId())
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Partner Not Found"
                        )
                );

        boolean alreadyAssigned =
                assignmentRepository
                        .findByJobId(jobId)
                        .stream()
                        .anyMatch(
                                assignment ->
                                        assignment.getPartnerId()
                                                .equals(request.getPartnerId())
                        );

        if (alreadyAssigned) {

            throw new BadRequestException(
                    "Partner Already Assigned To This Job"
            );

        }

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("User not found"));

         JobPartnerAssignment assignment = JobPartnerAssignment.builder()
                .jobId(jobId)
                .partnerId(request.getPartnerId())
                .assignedBy(user.getId())
                .assignedAt(LocalDateTime.now())
                .build();

        assignmentRepository.save(assignment);

        return "Partner Assigned Successfully";

    }

    @Override
    public List<JobResponse> getJobsForPartner(
            Long partnerId
    ) {

        partnerRepository
                .findById(partnerId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Partner Not Found"
                        )
                );

        List<JobPartnerAssignment> assignments =
                assignmentRepository.findByPartnerId(partnerId);

        return assignments
                .stream()
                .map(JobPartnerAssignment::getJobId)
                .map(jobId ->
                        jobRepository
                                .findById(jobId)
                                .orElseThrow(
                                        () -> new ResourceNotFoundException(
                                                "Job Not Found"
                                        )
                                )
                )
                .map(this::mapToResponse)
                .toList();

    }




    private JobResponse mapToResponse(
            Job job
    ) {

        return JobResponse.builder()
                .id(job.getId())
                .clientId(job.getClientId())
                .title(job.getTitle())
                .description(job.getDescription())
                .vacancyCount(job.getVacancyCount())
                .status(job.getStatus())
                .createdBy(job.getCreatedBy())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();

    }

}