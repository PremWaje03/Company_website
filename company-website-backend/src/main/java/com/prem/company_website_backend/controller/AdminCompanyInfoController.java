package com.prem.company_website_backend.controller;

import com.prem.company_website_backend.dto.ApiResponse;
import com.prem.company_website_backend.model.CompanyInfoEntity;
import com.prem.company_website_backend.service.CompanyInfoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/company")
@CrossOrigin
public class AdminCompanyInfoController {

    private final CompanyInfoService service;

    public AdminCompanyInfoController(CompanyInfoService service) {
        this.service = service;
    }

    @PostMapping
    public ApiResponse<CompanyInfoEntity> saveOrUpdate(
            @RequestBody CompanyInfoEntity info) {

        CompanyInfoEntity saved = service.saveOrUpdate(info);

        return new ApiResponse<>(
                true,
                "Company information saved successfully",
                saved
        );
    }
}
