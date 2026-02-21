package com.prem.company_website_backend.controller;

import com.prem.company_website_backend.dto.ApiResponse;
import com.prem.company_website_backend.model.TestimonialEntity;
import com.prem.company_website_backend.service.TestimonialService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testimonials")
@CrossOrigin
public class TestimonialController {

    private final TestimonialService service;

    public TestimonialController(TestimonialService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<TestimonialEntity>> getTestimonials() {

        List<TestimonialEntity> testimonials = service.getActiveTestimonials();

        return new ApiResponse<>(
                true,
                "Testimonials fetched successfully",
                testimonials
        );
    }
}
