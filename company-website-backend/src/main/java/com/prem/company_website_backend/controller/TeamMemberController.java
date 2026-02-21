package com.prem.company_website_backend.controller;

import com.prem.company_website_backend.dto.ApiResponse;
import com.prem.company_website_backend.model.TeamMemberEntity;
import com.prem.company_website_backend.service.TeamMemberService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/team")
@CrossOrigin
public class TeamMemberController {

    private final TeamMemberService service;

    public TeamMemberController(TeamMemberService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<TeamMemberEntity>> getTeamMembers() {

        List<TeamMemberEntity> members = service.getActiveMembers();

        return new ApiResponse<>(
                true,
                "Team members fetched successfully",
                members
        );
    }
}
