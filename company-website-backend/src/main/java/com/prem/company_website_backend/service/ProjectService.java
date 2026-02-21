package com.prem.company_website_backend.service;

import com.prem.company_website_backend.exception.ResourceNotFoundException;
import com.prem.company_website_backend.model.ProjectEntity;
import com.prem.company_website_backend.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository repository;

    public ProjectService(ProjectRepository repository) {
        this.repository = repository;
    }

    public ProjectEntity addProject(ProjectEntity project) {
        project.setTitle(safeTrim(project.getTitle()));
        project.setDescription(safeTrim(project.getDescription()));
        project.setProjectUrl(safeTrim(project.getProjectUrl()));
        project.setImageUrl(safeTrim(project.getImageUrl()));

        if (project.getCreatedAt() == null) {
            project.setCreatedAt(LocalDateTime.now());
        }

        return repository.save(project);
    }

    public ProjectEntity updateProject(String id, ProjectEntity updated) {
        ProjectEntity existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        existing.setTitle(safeTrim(updated.getTitle()));
        existing.setDescription(safeTrim(updated.getDescription()));
        existing.setTechnologies(updated.getTechnologies());
        existing.setProjectUrl(safeTrim(updated.getProjectUrl()));
        existing.setImageUrl(safeTrim(updated.getImageUrl()));
        existing.setFeatured(updated.isFeatured());

        return repository.save(existing);
    }

    public ProjectEntity toggleProject(String id) {
        ProjectEntity project = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        project.setActive(!project.isActive());
        return repository.save(project);
    }

    public List<ProjectEntity> getAllProjects() {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(
                        ProjectEntity::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();
    }

    public List<ProjectEntity> getActiveProjects() {
        return repository.findByActiveTrue().stream()
                .sorted(Comparator.comparing(
                        ProjectEntity::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();
    }

    public List<ProjectEntity> getFeaturedProjects() {
        return repository.findByFeaturedTrueAndActiveTrue().stream()
                .sorted(Comparator.comparing(
                        ProjectEntity::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();
    }

    public void deleteProject(String id) {
        ProjectEntity project = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        repository.delete(project);
    }

    private String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }
}
