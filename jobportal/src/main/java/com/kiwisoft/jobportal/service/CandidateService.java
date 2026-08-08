package com.kiwisoft.jobportal.service;

import com.kiwisoft.jobportal.dto.request.AssignCandidateRequest;
import com.kiwisoft.jobportal.dto.request.CandidateRequest;
import com.kiwisoft.jobportal.dto.request.UpdateCandidateRequest;
import com.kiwisoft.jobportal.dto.response.CandidateDocumentResponse;
import com.kiwisoft.jobportal.dto.response.CandidateResponse;
import com.kiwisoft.jobportal.dto.response.DuplicateCandidateResponse;
import org.springframework.data.domain.Page;
import java.util.List;

public interface CandidateService {

    CandidateResponse createCandidate(
            CandidateRequest request
    );

    List<CandidateDocumentResponse> getCandidateDocuments(Long candidateId);

    List<CandidateResponse> getAllCandidates();

    Page<CandidateResponse> getCandidatesPage(
            int page,
            int size,
            String sortBy,
            String direction
    );

    List<CandidateResponse> searchCandidates(String keyword);

    Page<CandidateResponse> searchCandidatesPage(
            String keyword,
            int page,
            int size,
            String sortBy,
            String direction
    );
    CandidateResponse getCandidateById(
            Long id
    );

    CandidateResponse updateCandidate(
            Long id,
            UpdateCandidateRequest request
    );

    String deleteCandidate(
            Long id
    );


    String assignCandidate(
            Long candidateId,
            AssignCandidateRequest request
    );

    String restoreCandidate(Long id);

    Page<CandidateResponse> getDeletedCandidates(
            int page,
            int size
    );


    DuplicateCandidateResponse checkDuplicate(

            String email,
            String phone,
            String passport

    );

}