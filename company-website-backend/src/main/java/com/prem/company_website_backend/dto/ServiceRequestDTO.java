package com.prem.company_website_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ServiceRequestDTO {

    @NotBlank(message = "Service title is required")
    @Size(min = 3, max = 50)
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10)
    private String description;

    private String icon;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
