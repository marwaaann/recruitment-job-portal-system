package com.kiwisoft.jobportal.service;

import com.kiwisoft.jobportal.dto.request.ClientRequest;
import com.kiwisoft.jobportal.dto.response.ClientResponse;

import java.util.List;

public interface ClientService {

    ClientResponse createClient(ClientRequest request);

    List<ClientResponse> getAllClients();

    ClientResponse getClientById(Long id);

    ClientResponse updateClient(
            Long id,
            ClientRequest request
    );

    ClientResponse blockClient(Long id);
    ClientResponse deleteClient(Long id);


}