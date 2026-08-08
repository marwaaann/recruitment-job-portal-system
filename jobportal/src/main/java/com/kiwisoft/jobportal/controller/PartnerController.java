package com.kiwisoft.jobportal.controller;

import com.kiwisoft.jobportal.dto.request.PartnerRequest;
import com.kiwisoft.jobportal.dto.response.PartnerResponse;
import com.kiwisoft.jobportal.service.PartnerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.kiwisoft.jobportal.dto.request.UpdatePartnerRequest;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/partners")
@RequiredArgsConstructor
public class PartnerController {

    private final PartnerService partnerService;

    @PostMapping
    public PartnerResponse createPartner(
            @Valid
            @RequestBody PartnerRequest request
    ) {

        return partnerService.createPartner(request);
    }

    @GetMapping
    public List<PartnerResponse> getAllPartners() {

        return partnerService.getAllPartners();
    }

    @GetMapping("/{id}")
    public PartnerResponse getPartnerById(
            @PathVariable Long id
    ) {

        return partnerService.getPartnerById(id);
    }

    @PutMapping("/{id}")
    public PartnerResponse updatePartner(
            @PathVariable Long id,
            @Valid
            @RequestBody UpdatePartnerRequest request
    ) {

        return partnerService.updatePartner(id, request);
    }

    @PostMapping("/{id}/block")
    public PartnerResponse blockPartner(
            @PathVariable Long id
    ) {

        return partnerService.blockPartner(id);

    }

    @DeleteMapping("/{id}")
    public PartnerResponse deletePartner(
            @PathVariable Long id
    ) {

        System.out.println("DELETE API HIT");

        return partnerService.deletePartner(id);
    }



    @GetMapping("/page")
    public Page<PartnerResponse> getPartnersPage(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size

    ) {

        return partnerService.getPartnersPage(
                page,
                size
        );

    }



    @GetMapping("/page/search")
    public Page<PartnerResponse> searchPartners(

            @RequestParam String keyword,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size

    ) {

        return partnerService.searchPartnersPage(

                keyword,

                page,

                size

        );

    }




}