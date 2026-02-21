package com.prem.company_website_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.prem.company_website_backend.model.TeamMemberEntity;
import java.util.List;

public interface TeamMemberRepository
        extends MongoRepository<TeamMemberEntity, String> {

    List<TeamMemberEntity> findByActiveTrue();
}
