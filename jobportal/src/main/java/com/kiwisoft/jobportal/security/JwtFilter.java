package com.kiwisoft.jobportal.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.Cookie;
import org.springframework.web.filter.OncePerRequestFilter;
import lombok.RequiredArgsConstructor;
import java.io.IOException;
import com.kiwisoft.jobportal.repository.UserRepository;
import com.kiwisoft.jobportal.entity.User;
import com.kiwisoft.jobportal.exception.ForbiddenException;
import com.kiwisoft.jobportal.exception.ResourceNotFoundException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(

            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        String path = request.getServletPath();

        if (
                path.equals("/api/auth/login") ||
                        path.equals("/api/auth/register") ||
                        path.equals("/api/auth/refresh")
        ) {
            filterChain.doFilter(request, response);
            return;
        }




        String token = null;
        String email = null;

        // 1. Check Authorization Bearer header (essential for cross-origin SPA)
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        // 2. Fallback to accessToken cookie
        if (token == null && request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("accessToken".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token != null) {
            email = jwtUtil.extractEmail(token);
        }

        if (
                email != null &&
                        SecurityContextHolder
                                .getContext()
                                .getAuthentication() == null
        ) {

            if (!jwtUtil.validateToken(token)) {
                filterChain.doFilter(request, response);
                return;
            }

            Long userId = jwtUtil.extractUserId(token);

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));

            if (user.isLoggedOut()) {
                throw new ForbiddenException("User already logged out");
            }

            UserDetails userDetails =
                    customUserDetailsService.loadUserByUsername(email);

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            authToken.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request)
            );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authToken);
        
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}