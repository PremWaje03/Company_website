package com.prem.company_website_backend.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import com.prem.company_website_backend.model.TestimonialEntity;
import java.util.List;

public interface TestimonialRepository
        extends MongoRepository<TestimonialEntity, String> {

    List<TestimonialEntity> findByActiveTrue();
}
