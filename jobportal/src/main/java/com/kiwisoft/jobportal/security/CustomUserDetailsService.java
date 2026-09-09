package com.kiwisoft.jobportal.security;

import com.kiwisoft.jobportal.entity.User;
import com.kiwisoft.jobportal.repository.UserRepository;

import org.springframework.security.core.userdetails.*;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService
        implements UserDetailsService {

    private final UserRepository userRepository;

    @Override

    public UserDetails loadUserByUsername(
            String email)


            throws UsernameNotFoundException {

        User user= userRepository

                        .findByEmail(email)
                         .orElseThrow(
                                ()->new UsernameNotFoundException(
                                        "User not found"
                                )

                        );


        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }

}