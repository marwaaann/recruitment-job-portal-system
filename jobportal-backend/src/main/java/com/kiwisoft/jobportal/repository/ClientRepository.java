package com.kiwisoft.jobportal.repository;

import com.kiwisoft.jobportal.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface ClientRepository
        extends JpaRepository<Client, Long> {

    Optional<Client> findByEmail(String email);
}