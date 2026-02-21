package com.prem.company_website_backend.controller;

import com.prem.company_website_backend.dto.ApiResponse;
import com.prem.company_website_backend.model.TeamMemberEntity;
import com.prem.company_website_backend.service.TeamMemberService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/team")
@CrossOrigin
public class AdminTeamMemberController {

    private final TeamMemberService service;

    public AdminTeamMemberController(TeamMemberService service) {
        this.service = service;
    }

    // ✅ Add team member
    @PostMapping
    public ApiResponse<TeamMemberEntity> addMember(
            @RequestBody TeamMemberEntity member) {

        TeamMemberEntity saved = service.addMember(member);

        return new ApiResponse<>(
                true,
                "Team member added successfully",
                saved
        );
    }

    // ✅ Update team member
    @PutMapping("/{id}")
    public ApiResponse<TeamMemberEntity> updateMember(
            @PathVariable String id,
            @RequestBody TeamMemberEntity member) {

        TeamMemberEntity updated = service.updateMember(id, member);

        return new ApiResponse<>(
                true,
                "Team member updated successfully",
                updated
        );
    }

    // ✅ Toggle active/inactive
    @PatchMapping("/{id}/toggle")
    public ApiResponse<TeamMemberEntity> toggleMember(
            @PathVariable String id) {

        TeamMemberEntity toggled = service.toggleMember(id);

        return new ApiResponse<>(
                true,
                "Team member status toggled successfully",
                toggled
        );
    }

    // ✅ Get all team members (admin)
    @GetMapping
    public ApiResponse<List<TeamMemberEntity>> getAllMembers() {

        List<TeamMemberEntity> members = service.getAllMembers();

        return new ApiResponse<>(
                true,
                "All team members fetched successfully",
                members
        );
    }

    // ✅ Delete team member
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteMember(
            @PathVariable String id) {

        service.deleteMember(id);

        return new ApiResponse<>(
                true,
                "Team member deleted successfully",
                "Team member with id " + id + " deleted"
        );
    }
}
