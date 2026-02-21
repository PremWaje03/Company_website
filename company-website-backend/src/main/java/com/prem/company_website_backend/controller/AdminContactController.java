package com.prem.company_website_backend.controller;

import com.prem.company_website_backend.dto.ApiResponse;
import com.prem.company_website_backend.model.ContactEntity;
import com.prem.company_website_backend.service.ContactService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/contacts")
@CrossOrigin
public class AdminContactController {

    private final ContactService service;

    public AdminContactController(ContactService service) {
        this.service = service;
    }

    // ✅ Get all contacts
    @GetMapping
    public ApiResponse<List<ContactEntity>> getAllContacts() {

        List<ContactEntity> contacts = service.getAllContacts();

        return new ApiResponse<>(
                true,
                "All contacts fetched successfully",
                contacts
        );
    }

    // ✅ Get contacts by status
    @GetMapping("/status/{status}")
    public ApiResponse<List<ContactEntity>> getByStatus(
            @PathVariable String status) {

        List<ContactEntity> contacts = service.getContactsByStatus(status);

        return new ApiResponse<>(
                true,
                "Contacts fetched with status: " + status,
                contacts
        );
    }

    // ✅ Update contact status
    @PatchMapping("/{id}/status")
    public ApiResponse<ContactEntity> updateStatus(
            @PathVariable String id,
            @RequestParam String status) {

        ContactEntity updated = service.updateStatus(id, status);

        return new ApiResponse<>(
                true,
                "Contact status updated successfully",
                updated
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteContact(@PathVariable String id) {
        service.deleteContact(id);

        return new ApiResponse<>(
                true,
                "Contact deleted successfully",
                "Contact with id " + id + " deleted"
        );
    }
}
