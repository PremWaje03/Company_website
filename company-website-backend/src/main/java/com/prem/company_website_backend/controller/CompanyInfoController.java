package com.prem.company_website_backend.controller;

import com.prem.company_website_backend.dto.ApiResponse;
import com.prem.company_website_backend.model.CompanyInfoEntity;
import com.prem.company_website_backend.service.CompanyInfoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
@CrossOrigin
public class CompanyInfoController {

    private final CompanyInfoService service;

    public CompanyInfoController(CompanyInfoService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<CompanyInfoEntity> getCompanyInfo() {

        CompanyInfoEntity info = service.getCompanyInfo();

        return new ApiResponse<>(
                true,
                "Company information fetched successfully",
                info
        );
    }
}
