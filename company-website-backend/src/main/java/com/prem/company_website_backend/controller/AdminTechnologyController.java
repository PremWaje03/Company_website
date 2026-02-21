package com.prem.company_website_backend.controller;

import com.prem.company_website_backend.dto.ApiResponse;
import com.prem.company_website_backend.model.TechnologyEntity;
import com.prem.company_website_backend.service.TechnologyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/technologies")
@CrossOrigin
public class AdminTechnologyController {

    private final TechnologyService service;

    public AdminTechnologyController(TechnologyService service) {
        this.service = service;
    }

    // ✅ Add technology
    @PostMapping
    public ApiResponse<TechnologyEntity> addTechnology(
            @RequestBody TechnologyEntity tech) {

        TechnologyEntity saved = service.addTechnology(tech);

        return new ApiResponse<>(
                true,
                "Technology added successfully",
                saved
        );
    }

    // ✅ Update technology
    @PutMapping("/{id}")
    public ApiResponse<TechnologyEntity> updateTechnology(
            @PathVariable String id,
            @RequestBody TechnologyEntity tech) {

        TechnologyEntity updated = service.updateTechnology(id, tech);

        return new ApiResponse<>(
                true,
                "Technology updated successfully",
                updated
        );
    }

    // ✅ Toggle technology active/inactive
    @PatchMapping("/{id}/toggle")
    public ApiResponse<TechnologyEntity> toggleTechnology(
            @PathVariable String id) {

        TechnologyEntity toggled = service.toggleTechnology(id);

        return new ApiResponse<>(
                true,
                "Technology status toggled successfully",
                toggled
        );
    }

    // ✅ Get all technologies (admin)
    @GetMapping
    public ApiResponse<List<TechnologyEntity>> getAllTechnologies() {

        List<TechnologyEntity> technologies = service.getAllTechnologies();

        return new ApiResponse<>(
                true,
                "All technologies fetched successfully",
                technologies
        );
    }

    // ✅ Delete technology
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteTechnology(
            @PathVariable String id) {

        service.deleteTechnology(id);

        return new ApiResponse<>(
                true,
                "Technology deleted successfully",
                "Technology with id " + id + " deleted"
        );
    }
}
