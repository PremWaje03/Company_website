package com.prem.company_website_backend.controller;

import com.prem.company_website_backend.dto.ApiResponse;
import com.prem.company_website_backend.model.ProjectEntity;
import com.prem.company_website_backend.service.ProjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/projects")
@CrossOrigin
public class AdminProjectController {

    private final ProjectService service;

    public AdminProjectController(ProjectService service) {
        this.service = service;
    }

    // ✅ Add project
    @PostMapping
    public ApiResponse<ProjectEntity> addProject(
            @RequestBody ProjectEntity project) {

        ProjectEntity saved = service.addProject(project);

        return new ApiResponse<>(
                true,
                "Project added successfully",
                saved
        );
    }

    // ✅ Update project
    @PutMapping("/{id}")
    public ApiResponse<ProjectEntity> updateProject(
            @PathVariable String id,
            @RequestBody ProjectEntity project) {

        ProjectEntity updated = service.updateProject(id, project);

        return new ApiResponse<>(
                true,
                "Project updated successfully",
                updated
        );
    }

    // ✅ Toggle project active/inactive
    @PatchMapping("/{id}/toggle")
    public ApiResponse<ProjectEntity> toggleProject(
            @PathVariable String id) {

        ProjectEntity toggled = service.toggleProject(id);

        return new ApiResponse<>(
                true,
                "Project status toggled successfully",
                toggled
        );
    }

    // ✅ Get all projects (admin)
    @GetMapping
    public ApiResponse<List<ProjectEntity>> getAllProjects() {

        List<ProjectEntity> projects = service.getAllProjects();

        return new ApiResponse<>(
                true,
                "All projects fetched successfully",
                projects
        );
    }

    // ✅ Delete project
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteProject(
            @PathVariable String id) {

        service.deleteProject(id);

        return new ApiResponse<>(
                true,
                "Project deleted successfully",
                "Project with id " + id + " deleted"
        );
    }
}
