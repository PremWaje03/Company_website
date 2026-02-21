package com.prem.company_website_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.prem.company_website_backend.model.ProjectEntity;
import java.util.List;

public interface ProjectRepository
        extends MongoRepository<ProjectEntity, String> {

    List<ProjectEntity> findByActiveTrue();
    List<ProjectEntity> findByFeaturedTrueAndActiveTrue();
}
