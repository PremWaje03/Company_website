package com.prem.company_website_backend.controller;

import com.prem.company_website_backend.dto.ApiResponse;
import com.prem.company_website_backend.model.ProjectEntity;
import com.prem.company_website_backend.service.ProjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    // ✅ All active projects
    @GetMapping
    public ApiResponse<List<ProjectEntity>> getProjects() {

        List<ProjectEntity> projects = service.getActiveProjects();

        return new ApiResponse<>(
                true,
                "Projects fetched successfully",
                projects
        );
    }

    // ✅ Featured projects (Home page)
    @GetMapping("/featured")
    public ApiResponse<List<ProjectEntity>> getFeaturedProjects() {

        List<ProjectEntity> featured = service.getFeaturedProjects();

        return new ApiResponse<>(
                true,
                "Featured projects fetched successfully",
                featured
        );
    }
}
