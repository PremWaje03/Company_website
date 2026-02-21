package com.prem.company_website_backend.controller;

import com.prem.company_website_backend.dto.ApiResponse;
import com.prem.company_website_backend.dto.ServiceRequestDTO;
import com.prem.company_website_backend.model.ServiceEntity;
import com.prem.company_website_backend.service.ServiceService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/services")
@CrossOrigin
public class AdminServiceController {

    private final ServiceService service;

    public AdminServiceController(ServiceService service) {
        this.service = service;
    }

    // ✅ Add service
    @PostMapping
    public ApiResponse<ServiceEntity> addService(
            @Valid @RequestBody ServiceRequestDTO dto) {

        ServiceEntity entity = new ServiceEntity();
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setIcon(dto.getIcon());

        return new ApiResponse<>(
                true,
                "Service added successfully",
                service.addService(entity)
        );
    }


    // ✅ Delete service
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteService(
            @PathVariable String id) {

        service.deleteService(id);

        return new ApiResponse<>(
                true,
                "Service deleted successfully",
                "Service with id " + id + " deleted"
        );
    }

    // ✅ Update service
    @PutMapping("/{id}")
    public ApiResponse<ServiceEntity> updateService(
            @PathVariable String id,
            @RequestBody ServiceEntity serviceEntity) {

        ServiceEntity updated = service.updateService(id, serviceEntity);

        return new ApiResponse<>(
                true,
                "Service updated successfully",
                updated
        );
    }

    // ✅ Toggle service active/inactive
    @PatchMapping("/{id}/toggle")
    public ApiResponse<ServiceEntity> toggleService(
            @PathVariable String id) {

        ServiceEntity toggled = service.toggleService(id);

        return new ApiResponse<>(
                true,
                "Service status toggled successfully",
                toggled
        );
    }

    // ✅ Get all services (admin)
    @GetMapping
    public ApiResponse<List<ServiceEntity>> getAllServices() {

        List<ServiceEntity> services = service.getAllServices();

        return new ApiResponse<>(
                true,
                "All services fetched successfully",
                services
        );
    }
}
