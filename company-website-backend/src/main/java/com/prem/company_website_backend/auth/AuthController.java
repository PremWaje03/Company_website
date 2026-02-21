package com.prem.company_website_backend.auth;

import com.prem.company_website_backend.service.AdminService;
import com.prem.company_website_backend.model.AdminEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Locale;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AdminService adminService;
    private final JwtUtil jwtUtil;

    public AuthController(AdminService adminService, JwtUtil jwtUtil) {
        this.adminService = adminService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> request) {

        String email = request.getOrDefault("email", "").trim().toLowerCase(Locale.ROOT);
        String password = request.get("password");

        AdminEntity admin = adminService.authenticate(email, password);
        String token = jwtUtil.generateToken(admin.getEmail());

        return Map.of("token", token);
    }
}
