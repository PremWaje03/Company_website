package com.prem.company_website_backend.controller;

import com.prem.company_website_backend.dto.ApiResponse;
import com.prem.company_website_backend.model.ServiceEntity;
import com.prem.company_website_backend.service.ServiceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin
public class ServiceController {

    private final ServiceService service;

    public ServiceController(ServiceService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<ServiceEntity>> getServices() {

        List<ServiceEntity> services = service.getActiveServices();

        return new ApiResponse<>(
                true,
                "Services fetched successfully",
                services
        );
    }
}
