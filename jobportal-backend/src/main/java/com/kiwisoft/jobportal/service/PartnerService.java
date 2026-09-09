package com.kiwisoft.jobportal.service;

import com.kiwisoft.jobportal.dto.request.PartnerRequest;
import com.kiwisoft.jobportal.dto.response.PartnerResponse;
import com.kiwisoft.jobportal.dto.request.UpdatePartnerRequest;
import java.util.List;
import org.springframework.data.domain.Page;
public interface PartnerService {

    PartnerResponse createPartner(PartnerRequest request);

    List<PartnerResponse> getAllPartners();

    PartnerResponse getPartnerById(Long id);

    PartnerResponse updatePartner(
            Long id,
            UpdatePartnerRequest request
    );

    PartnerResponse blockPartner(Long id);

    PartnerResponse deletePartner(Long id);

    Page<PartnerResponse> getPartnersPage(
            int page,
            int size
    );

    Page<PartnerResponse> searchPartnersPage(
            String keyword,
            int page,
            int size
    );
}