package com.prem.company_website_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.prem.company_website_backend.model.CompanyInfoEntity;

public interface CompanyInfoRepository
        extends MongoRepository<CompanyInfoEntity, String> {
}
