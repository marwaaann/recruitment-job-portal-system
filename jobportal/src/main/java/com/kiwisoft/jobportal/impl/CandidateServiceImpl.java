package com.kiwisoft.jobportal.impl;

import com.kiwisoft.jobportal.dto.request.AssignCandidateRequest;
import com.kiwisoft.jobportal.dto.request.CandidateRequest;
import com.kiwisoft.jobportal.dto.request.UpdateCandidateRequest;
import com.kiwisoft.jobportal.dto.response.CandidateDocumentResponse;
import com.kiwisoft.jobportal.dto.response.CandidateResponse;
import com.kiwisoft.jobportal.dto.response.DuplicateCandidateResponse;
import com.kiwisoft.jobportal.entity.*;
import com.kiwisoft.jobportal.enums.CandidateStatus;
import com.kiwisoft.jobportal.enums.Role;
import com.kiwisoft.jobportal.exception.ResourceNotFoundException;
import com.kiwisoft.jobportal.repository.*;
import com.kiwisoft.jobportal.service.CandidateService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.kiwisoft.jobportal.repository.UserRepository;
import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.data.domain.Sort;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateServiceImpl implements CandidateService {

    private final CandidateRepository candidateRepository;

    private final CandidateProfileRepository candidateProfileRepository;
    private final CandidateAssignmentRepository candidateAssignmentRepository;

    private final PartnerRepository partnerRepository;


    private final UserRepository userRepository;

    @Override
    public CandidateResponse createCandidate(CandidateRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        System.out.println("==================================");
        System.out.println("Logged User : " + user.getEmail());
        System.out.println("Role        : " + user.getRole());
        System.out.println("==================================");

        Long partnerId = null;

        // PARTNER LOGIN
        if (user.getRole() == Role.PARTNER) {

            Partner partner = partnerRepository.findByUser(user)
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Partner not found"));

            partnerId = partner.getId();

            System.out.println("Partner Id = " + partnerId);

        }

        // ADMIN OR SUPER ADMIN LOGIN
        else if (user.getRole() == Role.ADMIN ||
                user.getRole() == Role.SUPER_ADMIN) {

            partnerId = request.getPartnerId();

            System.out.println("Partner Id From Request = " + partnerId);

            if (partnerId == null || partnerId <= 0) {
                throw new ResourceNotFoundException("Valid Partner Id is required");
            }

            partnerRepository.findById(partnerId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Partner not found"));
        }

        Candidate candidate = Candidate.builder()
                .passportNumber(request.getPassportNumber())
                .passportHash(request.getPassportHash())
                .phoneNormalized(request.getPhoneNormalized())
                .email(request.getEmail())
                .fullName(request.getFullName())
                .dob(request.getDob())
                .nationality(request.getNationality())
                .createdByUserId(user.getId())
                .createdByPartnerId(partnerId)
                .canonicalStatus(CandidateStatus.ACTIVE)
                .build();

        Candidate savedCandidate = candidateRepository.save(candidate);

        CandidateProfile profile = CandidateProfile.builder()
                .candidate(savedCandidate)
                .experience(request.getExperience())
                .education(request.getEducation())
                .customFields(request.getCustomFields())
                .lastIndexedAt(LocalDateTime.now())
                .build();

        candidateProfileRepository.save(profile);

        return mapToResponse(savedCandidate, profile);
    }

    @Override
    public List<CandidateResponse> getAllCandidates() {

        return candidateRepository.findAll()
                .stream()
                .map(candidate -> {

                    CandidateProfile profile =
                            candidateProfileRepository
                                    .findById(candidate.getId())
                                    .orElse(null);

                    return mapToResponse(candidate, profile);

                })
                .toList();

    }

    @Override
    public Page<CandidateResponse> getCandidatesPage(
            int page,
            int size,
            String sortBy,
            String direction
    ) {

        Sort sort = direction.equalsIgnoreCase("asc")

                ? Sort.by(sortBy).ascending()

                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(
                page,
                size,
                sort
        );

        Page<Candidate> candidates =
                candidateRepository.findByCanonicalStatus(
                        CandidateStatus.ACTIVE,
                        pageable
                );

        return candidates.map(candidate -> {

            CandidateProfile profile =
                    candidateProfileRepository
                            .findByCandidate(candidate)
                            .orElse(null);

            return mapToResponse(candidate, profile);

        });

    }

    @Override
    public Page<CandidateResponse> getDeletedCandidates(
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Candidate> candidates =
                candidateRepository
                        .findByCanonicalStatus(
                                CandidateStatus.DELETED,
                                pageable
                        );

        return candidates.map(candidate -> {

            CandidateProfile profile =
                    candidateProfileRepository
                            .findByCandidate(candidate)
                            .orElse(null);

            return mapToResponse(candidate, profile);

        });

    }

    @Override
    public CandidateResponse getCandidateById(Long id) {

        Candidate candidate =
                candidateRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Candidate Not Found"));

        CandidateProfile profile =
                candidateProfileRepository
                        .findById(id)
                        .orElse(null);

        return mapToResponse(candidate, profile);

    }

    @Override
    public CandidateResponse updateCandidate(
            Long id,
            UpdateCandidateRequest request
    ) {

        Candidate candidate =
                candidateRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Candidate Not Found"));

        candidate.setPassportNumber(request.getPassportNumber());
        candidate.setPhoneNormalized(request.getPhoneNormalized());
        candidate.setEmail(request.getEmail());
        candidate.setFullName(request.getFullName());
        candidate.setDob(request.getDob());
        candidate.setNationality(request.getNationality());

        Candidate updatedCandidate =
                candidateRepository.save(candidate);

        CandidateProfile profile =
                candidateProfileRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Candidate Profile Not Found"));

        profile.setExperience(request.getExperience());
        profile.setEducation(request.getEducation());
        profile.setCustomFields(request.getCustomFields());
        profile.setLastIndexedAt(LocalDateTime.now());

        CandidateProfile updatedProfile =
                candidateProfileRepository.save(profile);

        return mapToResponse(updatedCandidate, updatedProfile);

    }

    @Override
    public List<CandidateDocumentResponse> getCandidateDocuments(
            Long candidateId) {

        candidateRepository.findById(candidateId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Candidate not found"));

        return List.of();

    }

    @Override
    public String deleteCandidate(Long id) {

        Candidate candidate =
                candidateRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Candidate Not Found"));

        candidate.setCanonicalStatus(CandidateStatus.DELETED);

        candidateRepository.save(candidate);

        return "Candidate Deleted Successfully";

    }


    @Override
    public String restoreCandidate(Long id) {

        Candidate candidate =
                candidateRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Candidate Not Found"
                                ));

        candidate.setCanonicalStatus(CandidateStatus.ACTIVE);

        candidateRepository.save(candidate);

        return "Candidate Restored Successfully";

    }


    @Override
    public String assignCandidate(
            Long candidateId,
            AssignCandidateRequest request
    ) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));


        Candidate candidate =
                candidateRepository
                        .findById(candidateId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Candidate Not Found"
                                )
                        );

        partnerRepository
                .findById(request.getPartnerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Partner Not Found"
                        )
                );

        CandidateAssignment assignment =
                CandidateAssignment.builder()
                        .candidateId(candidate.getId())
                        .partnerId(request.getPartnerId())
                        .assignedBy(user.getId())
                        .build();

        candidateAssignmentRepository.save(assignment);

        return "Candidate Assigned Successfully";

    }

    @Override
    public List<CandidateResponse> searchCandidates(String keyword) {

        List<Candidate> candidates =
                candidateRepository.searchCandidates(keyword);

        return candidates.stream()
                .map(candidate -> {

                    CandidateProfile profile =
                            candidateProfileRepository
                                    .findByCandidate(candidate)
                                    .orElse(null);

                    return mapToResponse(candidate, profile);

                })
                .toList();
    }

    @Override
    public Page<CandidateResponse> searchCandidatesPage(
            String keyword,
            int page,
            int size,
            String sortBy,
            String direction
    ) {

        Sort sort = direction.equalsIgnoreCase("asc")

                ? Sort.by(sortBy).ascending()

                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(
                page,
                size,
                sort
        );


        Page<Candidate> candidates =
                candidateRepository.searchCandidates(
                        keyword,
                        pageable
                );

        return candidates.map(candidate -> {

            CandidateProfile profile =
                    candidateProfileRepository
                            .findByCandidate(candidate)
                            .orElse(null);

            return mapToResponse(candidate, profile);

        });

    }


    @Override
    public DuplicateCandidateResponse checkDuplicate(
            String email,
            String phone,
            String passport
    ) {

        if (passport != null && !passport.isBlank()) {

            var candidate =
                    candidateRepository.findByPassportNumber(passport);

            if (candidate.isPresent()) {

                return DuplicateCandidateResponse.builder()
                        .duplicate(true)
                        .candidateId(candidate.get().getId())
                        .message("Duplicate found by passport")
                        .build();

            }
        }

        if (email != null && !email.isBlank()) {

            var candidate =
                    candidateRepository.findByEmail(email);

            if (candidate.isPresent()) {

                return DuplicateCandidateResponse.builder()
                        .duplicate(true)
                        .candidateId(candidate.get().getId())
                        .message("Duplicate found by email")
                        .build();

            }
        }

        if (phone != null && !phone.isBlank()) {

            var candidate =
                    candidateRepository.findByPhoneNormalized(phone);

            if (candidate.isPresent()) {

                return DuplicateCandidateResponse.builder()
                        .duplicate(true)
                        .candidateId(candidate.get().getId())
                        .message("Duplicate found by phone")
                        .build();

            }
        }

        return DuplicateCandidateResponse.builder()
                .duplicate(false)
                .candidateId(null)
                .message("No duplicate found")
                .build();

    }

    private CandidateResponse mapToResponse(
            Candidate candidate,
            CandidateProfile profile
    ) {

        return CandidateResponse.builder()
                .id(candidate.getId())
                .passportNumber(candidate.getPassportNumber())
                .phoneNormalized(candidate.getPhoneNormalized())
                .email(candidate.getEmail())
                .fullName(candidate.getFullName())
                .dob(candidate.getDob())
                .nationality(candidate.getNationality())
                .canonicalStatus(candidate.getCanonicalStatus())
                .createdByUserId(candidate.getCreatedByUserId())
                .createdByPartnerId(candidate.getCreatedByPartnerId())
                .createdAt(candidate.getCreatedAt())
                .updatedAt(candidate.getUpdatedAt())
                .experience(profile != null ? profile.getExperience() : null)
                .education(profile != null ? profile.getEducation() : null)
                .customFields(profile != null ? profile.getCustomFields() : null)
                .build();

    }

}