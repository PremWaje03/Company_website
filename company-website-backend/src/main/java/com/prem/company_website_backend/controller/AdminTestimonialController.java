package com.prem.company_website_backend.controller;

import com.prem.company_website_backend.dto.ApiResponse;
import com.prem.company_website_backend.model.TestimonialEntity;
import com.prem.company_website_backend.service.TestimonialService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/testimonials")
@CrossOrigin
public class AdminTestimonialController {

    private final TestimonialService service;

    public AdminTestimonialController(TestimonialService service) {
        this.service = service;
    }

    // ✅ Add testimonial
    @PostMapping
    public ApiResponse<TestimonialEntity> addTestimonial(
            @RequestBody TestimonialEntity testimonial) {

        TestimonialEntity saved = service.addTestimonial(testimonial);

        return new ApiResponse<>(
                true,
                "Testimonial added successfully",
                saved
        );
    }

    // ✅ Update testimonial
    @PutMapping("/{id}")
    public ApiResponse<TestimonialEntity> updateTestimonial(
            @PathVariable String id,
            @RequestBody TestimonialEntity testimonial) {

        TestimonialEntity updated = service.updateTestimonial(id, testimonial);

        return new ApiResponse<>(
                true,
                "Testimonial updated successfully",
                updated
        );
    }

    // ✅ Toggle testimonial active/inactive
    @PatchMapping("/{id}/toggle")
    public ApiResponse<TestimonialEntity> toggleTestimonial(
            @PathVariable String id) {

        TestimonialEntity toggled = service.toggleTestimonial(id);

        return new ApiResponse<>(
                true,
                "Testimonial status toggled successfully",
                toggled
        );
    }

    // ✅ Get all testimonials (admin)
    @GetMapping
    public ApiResponse<List<TestimonialEntity>> getAllTestimonials() {

        List<TestimonialEntity> testimonials = service.getAllTestimonials();

        return new ApiResponse<>(
                true,
                "All testimonials fetched successfully",
                testimonials
        );
    }

    // ✅ Delete testimonial
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteTestimonial(
            @PathVariable String id) {

        service.deleteTestimonial(id);

        return new ApiResponse<>(
                true,
                "Testimonial deleted successfully",
                "Testimonial with id " + id + " deleted"
        );
    }
}
