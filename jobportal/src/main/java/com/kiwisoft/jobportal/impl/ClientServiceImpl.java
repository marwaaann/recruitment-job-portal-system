package com.kiwisoft.jobportal.impl;

import com.kiwisoft.jobportal.dto.request.ClientRequest;
import com.kiwisoft.jobportal.dto.response.ClientResponse;
import com.kiwisoft.jobportal.entity.Client;
import com.kiwisoft.jobportal.entity.User;
import com.kiwisoft.jobportal.enums.Role;
import com.kiwisoft.jobportal.exception.BadRequestException;
import com.kiwisoft.jobportal.exception.ForbiddenException;
import com.kiwisoft.jobportal.exception.ResourceNotFoundException;
import com.kiwisoft.jobportal.repository.ClientRepository;
import com.kiwisoft.jobportal.repository.UserRepository;
import com.kiwisoft.jobportal.service.ClientService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;


    @Override
    public ClientResponse createClient(
            ClientRequest request
    ) {

        System.out.println("========== REQUEST ==========");
        System.out.println("Full Name : " + request.getFullName());
        System.out.println("Email     : " + request.getEmail());
        System.out.println("Password  : " + request.getPassword());
        System.out.println("Phone     : " + request.getPhone());
        System.out.println("Company   : " + request.getCompany());
        System.out.println("Address   : " + request.getAddress());
        System.out.println("=============================");


        if(userRepository.existsByEmail(request.getEmail())){

            throw new BadRequestException(
                    "Email Already Exists"
            );

        }

        Client client = Client.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .company(request.getCompany())
                .address(request.getAddress())
                .active(true)
                .build();

        Client savedClient = clientRepository.save(client);

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CLIENT)
                .active(true)
                .build();

        userRepository.save(user);
        return mapToResponse(savedClient);

    }

    @Override
    public List<ClientResponse> getAllClients() {

        return clientRepository.findAll()

                .stream()

                .map(this::mapToResponse)

                .toList();

    }

    @Override
    public ClientResponse getClientById(
            Long id
    ) {

        Client client =

                clientRepository.findById(id)

                        .orElseThrow(

                                ()->new ResourceNotFoundException(

                                        "Client Not Found"

                                )

                        );

        return mapToResponse(client);

    }

    @Override
    public ClientResponse updateClient(

            Long id,

            ClientRequest request

    ) {

        Client client =

                clientRepository.findById(id)

                        .orElseThrow(

                                ()->new ResourceNotFoundException(

                                        "Client Not Found"

                                )

                        );

        User user =

                userRepository.findByEmail(

                        client.getEmail()

                ).orElseThrow(

                        ()->new ResourceNotFoundException(

                                "User Not Found"

                        )

                );

        client.setFullName(
                request.getFullName()
        );

        client.setEmail(
                request.getEmail()
        );

        client.setPhone(
                request.getPhone()
        );

        client.setCompany(
                request.getCompany()
        );

        client.setAddress(
                request.getAddress()
        );

        clientRepository.save(client);

        user.setFullName(
                request.getFullName()
        );

        user.setEmail(
                request.getEmail()
        );

        if(request.getPassword()!=null
                &&
                !request.getPassword().isBlank()){

            user.setPassword(

                    passwordEncoder.encode(

                            request.getPassword()

                    )

            );

        }

        userRepository.save(user);

        return mapToResponse(client);

    }



    @Override
    public ClientResponse blockClient(
            Long id
    ) {

        Client client =
                clientRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Client Not Found"
                                )
                        );

        User user =
                userRepository
                        .findByEmail(client.getEmail())
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "User Not Found"
                                )
                        );

        client.setActive(false);

        user.setActive(false);

        clientRepository.save(client);

        userRepository.save(user);

        return mapToResponse(client);

    }

    @Override
    public ClientResponse deleteClient(Long id) {

        Client client = clientRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Client Not Found"));

        User user = userRepository.findByEmail(client.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User Not Found"));

        if (user.getRole() != Role.CLIENT) {
            throw new ForbiddenException("User is not a Client");
        }

        client.setActive(false);
        user.setActive(false);

        clientRepository.save(client);
        userRepository.save(user);

        return mapToResponse(client);
    }

    private ClientResponse mapToResponse(
            Client client
    ) {

        return ClientResponse.builder()
                .id(client.getId())
                .fullName(client.getFullName())
                .email(client.getEmail())
                .phone(client.getPhone())
                .company(client.getCompany())
                .address(client.getAddress())
                .active(client.isActive())
                .build();

    }

}