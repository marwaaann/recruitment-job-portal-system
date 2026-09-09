package com.kiwisoft.jobportal.controller;

import com.kiwisoft.jobportal.dto.request.ClientRequest;
import com.kiwisoft.jobportal.dto.response.ClientResponse;
import com.kiwisoft.jobportal.service.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @PostMapping
    public ClientResponse createClient(
            @Valid
            @RequestBody ClientRequest request
    ) {

        System.out.println("========== CREATE CLIENT HIT ==========");

        return clientService.createClient(request);
    }

    @GetMapping
    public List<ClientResponse> getAllClients() {
        return clientService.getAllClients();
    }

    @GetMapping("/{id}")
    public ClientResponse getClientById(
            @PathVariable Long id
    ) {
        return clientService.getClientById(id);
    }

    @PutMapping("/{id}")
    public ClientResponse updateClient(
            @PathVariable Long id,
            @Valid
            @RequestBody ClientRequest request
    ) {
        return clientService.updateClient(id, request);
    }

    @PostMapping("/{id}/block")
    public ClientResponse blockClient(
            @PathVariable Long id
    ){
        return clientService.blockClient(id);
    }

    @DeleteMapping("/{id}")
    public ClientResponse deleteClient(
            @PathVariable Long id
    ) {

        return clientService.deleteClient(id);

    }

}