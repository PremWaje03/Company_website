package com.prem.company_website_backend.service;

import com.prem.company_website_backend.exception.ResourceNotFoundException;
import com.prem.company_website_backend.model.TechnologyEntity;
import com.prem.company_website_backend.repository.TechnologyRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class TechnologyService {

    private final TechnologyRepository repository;

    public TechnologyService(TechnologyRepository repository) {
        this.repository = repository;
    }

    public TechnologyEntity addTechnology(TechnologyEntity tech) {
        tech.setName(safeTrim(tech.getName()));
        tech.setIcon(safeTrim(tech.getIcon()));
        if (tech.getCreatedAt() == null) {
            tech.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(tech);
    }

    public TechnologyEntity updateTechnology(String id, TechnologyEntity updated) {
        TechnologyEntity existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Technology not found"));

        existing.setName(safeTrim(updated.getName()));
        existing.setIcon(safeTrim(updated.getIcon()));

        return repository.save(existing);
    }

    public TechnologyEntity toggleTechnology(String id) {
        TechnologyEntity tech = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Technology not found"));

        tech.setActive(!tech.isActive());
        return repository.save(tech);
    }

    public List<TechnologyEntity> getAllTechnologies() {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(
                        TechnologyEntity::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();
    }

    public List<TechnologyEntity> getActiveTechnologies() {
        return repository.findByActiveTrue().stream()
                .sorted(Comparator.comparing(
                        TechnologyEntity::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();
    }

    public void deleteTechnology(String id) {
        TechnologyEntity tech = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Technology not found"));
        repository.delete(tech);
    }

    private String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }
}
