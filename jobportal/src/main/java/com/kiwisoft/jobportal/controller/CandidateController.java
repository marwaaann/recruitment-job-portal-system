package com.kiwisoft.jobportal.controller;

import com.kiwisoft.jobportal.dto.request.AssignCandidateRequest;
import com.kiwisoft.jobportal.dto.request.CandidateRequest;
import com.kiwisoft.jobportal.dto.request.UpdateCandidateRequest;
import com.kiwisoft.jobportal.dto.response.CandidateDocumentResponse;
import com.kiwisoft.jobportal.dto.response.DuplicateCandidateResponse;
import com.kiwisoft.jobportal.dto.response.CandidateResponse;
import com.kiwisoft.jobportal.service.CandidateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;

    // Add Candidate
    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','PARTNER')")
    public ResponseEntity<CandidateResponse> createCandidate(
            @RequestBody CandidateRequest request) {

        return ResponseEntity.ok(
                candidateService.createCandidate(request)
        );
    }

    // List Candidates
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','CLIENT','PARTNER')")
    public ResponseEntity<List<CandidateResponse>> getAllCandidates() {

        return ResponseEntity.ok(
                candidateService.getAllCandidates()
        );
    }

    // Candidate Profile
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','CLIENT','PARTNER')")
    public ResponseEntity<CandidateResponse> getCandidateById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                candidateService.getCandidateById(id)
        );
    }

    // Update Candidate
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','PARTNER')")
    public ResponseEntity<CandidateResponse> updateCandidate(
            @PathVariable Long id,
            @RequestBody UpdateCandidateRequest request) {

        return ResponseEntity.ok(
                candidateService.updateCandidate(id, request)
        );
    }


    @GetMapping("/search")
    public ResponseEntity<List<CandidateResponse>> searchCandidates(
            @RequestParam String keyword
    ) {

        return ResponseEntity.ok(
                candidateService.searchCandidates(keyword)
        );
    }

    @GetMapping("/page/search")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','CLIENT','PARTNER')")
    public ResponseEntity<Page<CandidateResponse>> searchCandidatesPage(

            @RequestParam String keyword,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "createdAt") String sortBy,

            @RequestParam(defaultValue = "desc") String direction

    ) {

        return ResponseEntity.ok(

                candidateService.searchCandidatesPage(

                        keyword,

                        page,

                        size,

                        sortBy,

                        direction

                )

        );

    }


// candidate id document

    @GetMapping("/{id}/documents")
    public ResponseEntity<List<CandidateDocumentResponse>> getCandidateDocuments(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                candidateService.getCandidateDocuments(id)
        );

    }

    // Soft Delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<String> deleteCandidate(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                candidateService.deleteCandidate(id)
        );
    }


    @PostMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<String> assignCandidate(

            @PathVariable Long id,
            @RequestBody AssignCandidateRequest request
    ) {

        return ResponseEntity.ok(
                candidateService.assignCandidate(id, request)
        );

    }



    @GetMapping("/duplicates/check")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','PARTNER')")
    public ResponseEntity<DuplicateCandidateResponse> checkDuplicate(

            @RequestParam(required = false) String email,

            @RequestParam(required = false) String phone,

            @RequestParam(required = false) String passport

    ) {

        return ResponseEntity.ok(

                candidateService.checkDuplicate(
                        email,
                        phone,
                        passport
                )

        );

    }

    @GetMapping("/page")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','CLIENT','PARTNER')")
    public ResponseEntity<Page<CandidateResponse>> getCandidatesPage(

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "createdAt") String sortBy,

            @RequestParam(defaultValue = "desc") String direction

    ) {

        return ResponseEntity.ok(

                candidateService.getCandidatesPage(

                        page,

                        size,

                        sortBy,

                        direction

                )

        );

    }


    @PutMapping("/{id}/restore")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<String> restoreCandidate(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                candidateService.restoreCandidate(id)
        );

    }





}