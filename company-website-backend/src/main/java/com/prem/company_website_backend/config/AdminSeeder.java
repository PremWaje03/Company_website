package com.prem.company_website_backend.config;

import com.prem.company_website_backend.model.AdminEntity;
import com.prem.company_website_backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Locale;

@Configuration
public class AdminSeeder {

    @Value("${app.admin.email:admin@gmail.com}")
    private String adminEmail;

    @Value("${app.admin.password:admin123}")
    private String adminPassword;

    @Bean
    CommandLineRunner seedAdmin(
            AdminRepository repo,
            BCryptPasswordEncoder encoder) {

        return args -> {
            String normalizedEmail = adminEmail.trim().toLowerCase(Locale.ROOT);

            if (repo.findByEmail(normalizedEmail).isEmpty()) {
                AdminEntity admin = new AdminEntity();
                admin.setEmail(normalizedEmail);
                admin.setPassword(encoder.encode(adminPassword));

                repo.save(admin);
                System.out.println("ADMIN CREATED: " + normalizedEmail);
            }
        };
    }
}
