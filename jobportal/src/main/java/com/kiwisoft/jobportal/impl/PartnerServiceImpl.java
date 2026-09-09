package com.kiwisoft.jobportal.impl;

import com.kiwisoft.jobportal.dto.request.PartnerRequest;
import com.kiwisoft.jobportal.dto.response.PartnerResponse;
import com.kiwisoft.jobportal.entity.Partner;
import com.kiwisoft.jobportal.entity.User;
import com.kiwisoft.jobportal.enums.Role;
import com.kiwisoft.jobportal.exception.ResourceNotFoundException;
import com.kiwisoft.jobportal.repository.PartnerRepository;
import com.kiwisoft.jobportal.repository.UserRepository;
import com.kiwisoft.jobportal.service.PartnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.kiwisoft.jobportal.dto.request.UpdatePartnerRequest;
import com.kiwisoft.jobportal.exception.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class PartnerServiceImpl implements PartnerService {
    private final PartnerRepository partnerRepository;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;



    @Override
    public PartnerResponse createPartner(
            PartnerRequest request
    ) {

        if(userRepository.existsByEmail(request.getEmail())){

            throw new BadRequestException(
                    "Email Already Exists"
            );

        }

        User user = User.builder()
                .fullName(request.getContactPerson())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.PARTNER)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        Partner partner = Partner.builder()
                .companyName(request.getCompanyName())
                .contactPerson(request.getContactPerson())
                .email(request.getEmail())
                .phone(request.getPhone())
                .website(request.getWebsite())
                .address(request.getAddress())
                .active(true)
                .user(savedUser)
                .build();


        Partner savedPartner = partnerRepository.save(partner);

        return mapToResponse(savedPartner);

    }

    @Override
    public List<PartnerResponse> getAllPartners() {

        return partnerRepository

                .findAll()

                .stream()

                .map(this::mapToResponse)

                .toList();

    }

    @Override
    public PartnerResponse getPartnerById(
            Long id
    ) {

        Partner partner =

                partnerRepository

                        .findById(id)

                        .orElseThrow(

                                ()->new ResourceNotFoundException(

                                        "Partner Not Found"

                                )

                        );

        return mapToResponse(partner);

    }

    @Override
    public PartnerResponse updatePartner(
            Long id,
            UpdatePartnerRequest request
    ) {

        Partner partner =
                partnerRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Partner Not Found"
                                )
                        );

        User user =
                userRepository
                        .findByEmail(partner.getEmail())
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "User Not Found"
                                )
                        );

        partner.setCompanyName(
                request.getCompanyName()
        );

        partner.setContactPerson(
                request.getContactPerson()
        );

        partner.setEmail(
                request.getEmail()
        );

        partner.setPhone(
                request.getPhone()
        );

        partner.setWebsite(
                request.getWebsite()
        );

        partner.setAddress(
                request.getAddress()
        );

        partnerRepository.save(partner);

        user.setFullName(
                request.getContactPerson()
        );

        user.setEmail(
                request.getEmail()
        );


        userRepository.save(user);

        return mapToResponse(partner);

    }

    @Override
    public PartnerResponse blockPartner(
            Long id
    ) {

        Partner partner =
                partnerRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Partner Not Found"
                                )
                        );

        User user =
                userRepository
                        .findByEmail(partner.getEmail())
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "User Not Found"
                                )
                        );

        partner.setActive(false);

        user.setActive(false);

        partnerRepository.save(partner);

        userRepository.save(user);

        return mapToResponse(partner);

    }

    @Override
    public PartnerResponse deletePartner(Long id) {

        Partner partner = partnerRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Partner Not Found"));

        User user = userRepository
                .findByEmail(partner.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User Not Found"));

        partner.setActive(false);
        user.setActive(false);

        partnerRepository.save(partner);
        userRepository.save(user);

        return mapToResponse(partner);
    }

    @Override
    public Page<PartnerResponse> getPartnersPage(
            int page,
            int size
    ) {

        Pageable pageable =
                PageRequest.of(page, size);

        return partnerRepository
                .findAll(pageable)
                .map(this::mapToResponse);

    }


    @Override
    public Page<PartnerResponse> searchPartnersPage(

            String keyword,

            int page,

            int size

    ) {

        Pageable pageable =
                PageRequest.of(page, size);

        return partnerRepository
                .searchPartners(
                        keyword,
                        pageable
                )
                .map(this::mapToResponse);

    }







    private PartnerResponse mapToResponse(
            Partner partner
    ) {

        return PartnerResponse.builder()
                .id(partner.getId())
                .companyName(partner.getCompanyName())
                .contactPerson(partner.getContactPerson())
                .email(partner.getEmail())
                .phone(partner.getPhone())
                .website(partner.getWebsite())
                .address(partner.getAddress())
                .active(partner.isActive())
                .build();

    }
}