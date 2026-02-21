package com.prem.company_website_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.prem.company_website_backend.model.TechnologyEntity;
import java.util.List;

public interface TechnologyRepository
        extends MongoRepository<TechnologyEntity, String> {

    List<TechnologyEntity> findByActiveTrue();
}
