package com.prem.company_website_backend.service;
import com.prem.company_website_backend.exception.ResourceNotFoundException;
import com.prem.company_website_backend.model.ServiceEntity;
import com.prem.company_website_backend.repository.ServiceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class ServiceService {

    private final ServiceRepository repository;

    public ServiceService(ServiceRepository repository) {
        this.repository = repository;
    }

    public ServiceEntity addService(ServiceEntity service) {
        service.setTitle(safeTrim(service.getTitle()));
        service.setDescription(safeTrim(service.getDescription()));
        service.setIcon(safeTrim(service.getIcon()));
        if (service.getCreatedAt() == null) {
            service.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(service);
    }

    public List<ServiceEntity> getAllServices() {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(
                        ServiceEntity::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();
    }

    public List<ServiceEntity> getActiveServices() {
        return repository.findByActiveTrue().stream()
                .sorted(Comparator.comparing(
                        ServiceEntity::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();
    }

    public void deleteService(String id) {
        ServiceEntity service = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        repository.delete(service);
    }

    public ServiceEntity updateService(String id, ServiceEntity updated) {

        ServiceEntity existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        existing.setTitle(safeTrim(updated.getTitle()));
        existing.setDescription(safeTrim(updated.getDescription()));
        existing.setIcon(safeTrim(updated.getIcon()));

        return repository.save(existing);
    }

    public ServiceEntity toggleService(String id) {

        ServiceEntity service = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        service.setActive(!service.isActive());
        return repository.save(service);
    }

    private String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }

}
