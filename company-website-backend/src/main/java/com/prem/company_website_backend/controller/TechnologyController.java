package com.prem.company_website_backend.controller;

import com.prem.company_website_backend.dto.ApiResponse;
import com.prem.company_website_backend.model.TechnologyEntity;
import com.prem.company_website_backend.service.TechnologyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/technologies")
@CrossOrigin
public class TechnologyController {

    private final TechnologyService service;

    public TechnologyController(TechnologyService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<TechnologyEntity>> getTechnologies() {

        List<TechnologyEntity> technologies = service.getActiveTechnologies();

        return new ApiResponse<>(
                true,
                "Technologies fetched successfully",
                technologies
        );
    }
}
