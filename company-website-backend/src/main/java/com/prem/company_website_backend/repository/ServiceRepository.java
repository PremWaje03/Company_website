package com.prem.company_website_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.prem.company_website_backend.model.ServiceEntity;
import java.util.List;

public interface ServiceRepository extends MongoRepository<ServiceEntity, String> {
    List<ServiceEntity> findByActiveTrue();
}
