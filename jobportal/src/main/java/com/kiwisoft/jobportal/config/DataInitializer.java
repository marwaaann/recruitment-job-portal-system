package com.kiwisoft.jobportal.config;

import com.kiwisoft.jobportal.entity.User;
import com.kiwisoft.jobportal.enums.Role;
import com.kiwisoft.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedSuperAdmin("marwan@gmail.com", "Marwan Shafi", "superadmin@123");
    }

    private void seedSuperAdmin(String email, String fullName, String rawPassword) {
        userRepository.findByEmail(email).ifPresentOrElse(
                user -> {
                    boolean modified = false;
                    if (user.getRole() != Role.SUPER_ADMIN) {
                        user.setRole(Role.SUPER_ADMIN);
                        modified = true;
                    }
                    if (!user.isActive()) {
                        user.setActive(true);
                        modified = true;
                    }
                    if (modified) {
                        userRepository.save(user);
                        log.info("Updated existing user {} to active SUPER_ADMIN", email);
                    }
                },
                () -> {
                    User superAdmin = User.builder()
                            .fullName(fullName)
                            .email(email)
                            .password(passwordEncoder.encode(rawPassword))
                            .role(Role.SUPER_ADMIN)
                            .active(true)
                            .loggedOut(false)
                            .build();
                    userRepository.save(superAdmin);
                    log.info("Default Super Admin seeded: {}", email);
                }
        );
    }
}
