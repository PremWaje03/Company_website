package com.prem.company_website_backend.service;

import com.prem.company_website_backend.exception.ResourceNotFoundException;
import com.prem.company_website_backend.model.ContactEntity;
import com.prem.company_website_backend.repository.ContactRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class ContactService {

    private static final Set<String> ALLOWED_STATUSES = Set.of(
            "NEW",
            "IN_PROGRESS",
            "RESOLVED"
    );

    private final ContactRepository repository;

    public ContactService(ContactRepository repository) {
        this.repository = repository;
    }

    public ContactEntity saveContact(ContactEntity contact) {
        contact.setName(safeTrim(contact.getName()));
        contact.setEmail(safeTrim(contact.getEmail()).toLowerCase(Locale.ROOT));
        contact.setPhone(safeTrim(contact.getPhone()));
        contact.setMessage(safeTrim(contact.getMessage()));

        if (contact.getStatus() == null || contact.getStatus().isBlank()) {
            contact.setStatus("NEW");
        } else {
            contact.setStatus(normalizeStatus(contact.getStatus()));
        }

        if (contact.getCreatedAt() == null) {
            contact.setCreatedAt(LocalDateTime.now());
        }

        return repository.save(contact);
    }

    public List<ContactEntity> getAllContacts() {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(
                        ContactEntity::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();
    }

    public List<ContactEntity> getContactsByStatus(String status) {
        String normalizedStatus = normalizeStatus(status);
        return repository.findByStatusIgnoreCase(normalizedStatus).stream()
                .sorted(Comparator.comparing(
                        ContactEntity::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();
    }

    public ContactEntity updateStatus(String id, String status) {
        ContactEntity contact = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));

        contact.setStatus(normalizeStatus(status));
        return repository.save(contact);
    }

    public void deleteContact(String id) {
        ContactEntity contact = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
        repository.delete(contact);
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status is required");
        }

        String normalized = status.trim()
                .replace("-", "_")
                .replace(" ", "_")
                .toUpperCase(Locale.ROOT);

        if (!ALLOWED_STATUSES.contains(normalized)) {
            throw new IllegalArgumentException("Invalid status. Allowed values: NEW, IN_PROGRESS, RESOLVED");
        }
        return normalized;
    }

    private String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }
}
