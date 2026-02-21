package com.prem.company_website_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.prem.company_website_backend.model.ContactEntity;
import java.util.List;

public interface ContactRepository
        extends MongoRepository<ContactEntity, String> {

    List<ContactEntity> findByStatusIgnoreCase(String status);
}
