package com.prem.company_website_backend.service;

import com.prem.company_website_backend.model.CompanyInfoEntity;
import com.prem.company_website_backend.repository.CompanyInfoRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CompanyInfoService {

    private static final String COMPANY_INFO_ID = "company-profile";

    private final CompanyInfoRepository repository;

    public CompanyInfoService(CompanyInfoRepository repository) {
        this.repository = repository;
    }

    public CompanyInfoEntity getCompanyInfo() {
        return repository.findById(COMPANY_INFO_ID)
                .orElseGet(() -> repository.findAll().stream().findFirst().orElse(null));
    }

    public CompanyInfoEntity saveOrUpdate(CompanyInfoEntity info) {
        if (info == null) {
            throw new IllegalArgumentException("Company info payload is required");
        }

        CompanyInfoEntity existing = repository.findById(COMPANY_INFO_ID)
                .orElseGet(CompanyInfoEntity::new);

        existing.setId(COMPANY_INFO_ID);
        existing.setCompanyName(safeTrim(info.getCompanyName()));
        existing.setAbout(safeTrim(info.getAbout()));
        existing.setEmail(safeTrim(info.getEmail()));
        existing.setPhone(safeTrim(info.getPhone()));
        existing.setAddress(safeTrim(info.getAddress()));
        existing.setSocialLinks(normalizeSocialLinks(info.getSocialLinks()));

        CompanyInfoEntity saved = repository.save(existing);
        cleanupDuplicateRecords(saved.getId());
        return saved;
    }

    private Map<String, String> normalizeSocialLinks(Map<String, String> socialLinks) {
        Map<String, String> normalized = new HashMap<>();
        if (socialLinks == null) {
            return normalized;
        }

        for (Map.Entry<String, String> entry : socialLinks.entrySet()) {
            if (entry.getKey() == null || entry.getKey().isBlank()) {
                continue;
            }
            normalized.put(entry.getKey(), safeTrim(entry.getValue()));
        }
        return normalized;
    }

    private void cleanupDuplicateRecords(String keepId) {
        List<CompanyInfoEntity> all = repository.findAll();
        for (CompanyInfoEntity item : all) {
            if (item.getId() != null && !item.getId().equals(keepId)) {
                repository.deleteById(item.getId());
            }
        }
    }

    private String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }
}
