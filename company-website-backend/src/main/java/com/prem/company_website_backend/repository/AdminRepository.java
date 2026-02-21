package com.prem.company_website_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.prem.company_website_backend.model.AdminEntity;
import java.util.Optional;

public interface AdminRepository
        extends MongoRepository<AdminEntity, String> {

    Optional<AdminEntity> findByEmail(String email);
}
