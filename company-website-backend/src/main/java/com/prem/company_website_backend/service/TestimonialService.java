package com.prem.company_website_backend.service;

import com.prem.company_website_backend.exception.ResourceNotFoundException;
import com.prem.company_website_backend.model.TestimonialEntity;
import com.prem.company_website_backend.repository.TestimonialRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class TestimonialService {

    private final TestimonialRepository repository;

    public TestimonialService(TestimonialRepository repository) {
        this.repository = repository;
    }

    public TestimonialEntity addTestimonial(TestimonialEntity testimonial) {
        testimonial.setClientName(safeTrim(testimonial.getClientName()));
        testimonial.setClientRole(safeTrim(testimonial.getClientRole()));
        testimonial.setMessage(safeTrim(testimonial.getMessage()));
        testimonial.setPhotoUrl(safeTrim(testimonial.getPhotoUrl()));
        if (testimonial.getCreatedAt() == null) {
            testimonial.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(testimonial);
    }

    public TestimonialEntity updateTestimonial(String id, TestimonialEntity updated) {
        TestimonialEntity existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found"));

        existing.setClientName(safeTrim(updated.getClientName()));
        existing.setClientRole(safeTrim(updated.getClientRole()));
        existing.setMessage(safeTrim(updated.getMessage()));
        existing.setRating(updated.getRating());
        existing.setPhotoUrl(safeTrim(updated.getPhotoUrl()));

        return repository.save(existing);
    }

    public TestimonialEntity toggleTestimonial(String id) {
        TestimonialEntity testimonial = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found"));

        testimonial.setActive(!testimonial.isActive());
        return repository.save(testimonial);
    }

    public List<TestimonialEntity> getAllTestimonials() {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(
                        TestimonialEntity::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();
    }

    public List<TestimonialEntity> getActiveTestimonials() {
        return repository.findByActiveTrue().stream()
                .sorted(Comparator.comparing(
                        TestimonialEntity::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();
    }

    public void deleteTestimonial(String id) {
        TestimonialEntity testimonial = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found"));
        repository.delete(testimonial);
    }

    private String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }
}
