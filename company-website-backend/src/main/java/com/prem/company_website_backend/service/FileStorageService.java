package com.prem.company_website_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path rootUploadPath;

    public FileStorageService(@Value("${app.upload.dir:uploads}") String uploadDir) throws IOException {
        this.rootUploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(this.rootUploadPath);
    }

    public String storeTeamImage(MultipartFile file) throws IOException {
        validateImage(file);

        Path teamDir = rootUploadPath.resolve("team");
        Files.createDirectories(teamDir);

        String extension = extractExtension(file.getOriginalFilename());
        String filename = System.currentTimeMillis() + "-" + UUID.randomUUID() + extension;

        Path target = teamDir.resolve(filename).normalize();
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/team/" + filename;
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }
    }

    private String extractExtension(String originalFilename) {
        String cleaned = StringUtils.cleanPath(originalFilename == null ? "" : originalFilename);
        int lastDot = cleaned.lastIndexOf('.');
        if (lastDot < 0) {
            return ".jpg";
        }
        return cleaned.substring(lastDot);
    }
}
