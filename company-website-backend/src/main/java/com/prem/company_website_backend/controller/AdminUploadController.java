package com.prem.company_website_backend.controller;

import com.prem.company_website_backend.dto.ApiResponse;
import com.prem.company_website_backend.service.FileStorageService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/uploads")
@CrossOrigin
public class AdminUploadController {

    private final FileStorageService fileStorageService;

    public AdminUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/team-image")
    public ApiResponse<Map<String, String>> uploadTeamImage(
            @RequestParam("file") MultipartFile file) throws IOException {

        String relativePath = fileStorageService.storeTeamImage(file);
        String absoluteUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(relativePath)
                .toUriString();

        return new ApiResponse<>(
                true,
                "Image uploaded successfully",
                Map.of(
                        "path", relativePath,
                        "url", absoluteUrl
                )
        );
    }
}
