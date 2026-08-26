package com.kiwisoft.jobportal.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import lombok.RequiredArgsConstructor;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder(){

        return new BCryptPasswordEncoder();

    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception{
        http
                .cors(cors -> {})
                .csrf(csrf -> csrf

                        .csrfTokenRepository(
                                CookieCsrfTokenRepository.withHttpOnlyFalse()
                        )

                        .csrfTokenRequestHandler(
                                new CsrfTokenRequestAttributeHandler()
                        )

                        .ignoringRequestMatchers(

                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/auth/refresh",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password"

                        )

                )
                .authorizeHttpRequests(auth -> auth


                        .requestMatchers(HttpMethod.OPTIONS,
                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/auth/refresh")
                        .permitAll()

                        // Public APIs
                        .requestMatchers("/api/auth/**")
                        .permitAll()

                        .requestMatchers("/api/csrf")
                        .permitAll()

                        .requestMatchers("/ws-chat/**")
                        .authenticated()

                        // ================= SUPER ADMIN =================
                        .requestMatchers("/api/admins/**")
                        .hasRole("SUPER_ADMIN")

                        // ================= PARTNER MANAGEMENT =================
                        .requestMatchers("/api/partners/**")
                        .hasAnyRole("SUPER_ADMIN", "ADMIN")

                        // ================= CLIENT MANAGEMENT =================
                        .requestMatchers("/api/clients/**")
                        .hasAnyRole("SUPER_ADMIN", "ADMIN")



                        // ================= CANDIDATE MANAGEMENT =================

                        // Add Candidate
                        .requestMatchers(org.springframework.http.HttpMethod.POST,
                                "/api/candidates")
                        .hasAnyRole("SUPER_ADMIN","ADMIN","PARTNER")


                        // Assign Candidate
                        .requestMatchers(
                                org.springframework.http.HttpMethod.POST,
                                "/api/candidates/*/assign")
                        .hasAnyRole("SUPER_ADMIN","ADMIN")

                        // Duplicate Check
                        .requestMatchers(
                                org.springframework.http.HttpMethod.GET,
                                "/api/candidates/duplicates/check")
                        .hasAnyRole("SUPER_ADMIN","ADMIN","PARTNER")

                        // List / View Candidate
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/api/candidates",
                                "/api/candidates/**")
                        .hasAnyRole("SUPER_ADMIN","ADMIN","CLIENT","PARTNER")

                        // Update Candidate
                        .requestMatchers(org.springframework.http.HttpMethod.PUT,
                                "/api/candidates/**")
                        .hasAnyRole("SUPER_ADMIN","ADMIN","PARTNER")

                        // Soft Delete Candidate
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE,
                                "/api/candidates/**")
                        .hasAnyRole("SUPER_ADMIN","ADMIN")




                        // ================= JOB MANAGEMENT =================

                        // Anyone logged in can view jobs
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/api/jobs",
                                "/api/jobs/**")
                        .authenticated()

                        // Create Job
                        .requestMatchers(org.springframework.http.HttpMethod.POST,
                                "/api/jobs")
                        .hasAnyRole("SUPER_ADMIN","ADMIN","CLIENT")

                        // Update Job
                        .requestMatchers(org.springframework.http.HttpMethod.PUT,
                                "/api/jobs/**")
                        .hasAnyRole("SUPER_ADMIN","ADMIN","CLIENT")

                        // Close Job
                        .requestMatchers(org.springframework.http.HttpMethod.POST,
                                "/api/jobs/*/close")
                        .hasAnyRole("SUPER_ADMIN","ADMIN")

                        // Assign Partner
                        .requestMatchers(org.springframework.http.HttpMethod.POST,
                                "/api/jobs/*/assign-partner")
                        .hasAnyRole("SUPER_ADMIN","ADMIN")

                        // Apply Job
                        .requestMatchers(org.springframework.http.HttpMethod.POST,
                                "/api/jobs/*/applications")
                        .hasRole("PARTNER")

                        // View Applications
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/api/jobs/*/applications")
                        .hasAnyRole("SUPER_ADMIN","ADMIN","CLIENT")

                        .anyRequest()
                        .authenticated()
                )

                .sessionManagement(

                        session ->

                                session

                                        .sessionCreationPolicy(

                                                SessionCreationPolicy.STATELESS

                                        )

                )

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );
        return http.build();

    }

}