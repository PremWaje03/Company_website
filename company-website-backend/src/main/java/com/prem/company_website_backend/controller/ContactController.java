package com.prem.company_website_backend.controller;

import com.prem.company_website_backend.dto.ApiResponse;
import com.prem.company_website_backend.dto.ContactRequestDTO;
import com.prem.company_website_backend.model.ContactEntity;
import com.prem.company_website_backend.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin
public class ContactController {

    private final ContactService service;

    public ContactController(ContactService service) {
        this.service = service;
    }

    @PostMapping
    public ApiResponse<ContactEntity> submitContact(
            @Valid @RequestBody ContactRequestDTO dto) {

        ContactEntity contact = new ContactEntity();
        contact.setName(dto.getName());
        contact.setEmail(dto.getEmail());
        contact.setPhone(dto.getPhone());
        contact.setMessage(dto.getMessage());

        return new ApiResponse<>(
                true,
                "Your enquiry has been submitted successfully",
                service.saveContact(contact)
        );
    }

}
