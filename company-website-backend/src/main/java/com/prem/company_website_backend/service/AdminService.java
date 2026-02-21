package com.prem.company_website_backend.service;

import com.prem.company_website_backend.model.AdminEntity;
import com.prem.company_website_backend.repository.AdminRepository;
import com.prem.company_website_backend.exception.UnauthorizedException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class AdminService {

    private final AdminRepository repository;
    private final BCryptPasswordEncoder encoder;

    public AdminService(AdminRepository repository,
                        BCryptPasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    public AdminEntity authenticate(String email, String password) {

        if (email == null || password == null) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);

        AdminEntity admin = repository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!encoder.matches(password, admin.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        return admin;
    }
}
