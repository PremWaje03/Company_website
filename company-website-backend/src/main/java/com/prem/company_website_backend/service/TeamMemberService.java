package com.prem.company_website_backend.service;

import com.prem.company_website_backend.exception.ResourceNotFoundException;
import com.prem.company_website_backend.model.TeamMemberEntity;
import com.prem.company_website_backend.repository.TeamMemberRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class TeamMemberService {

    private final TeamMemberRepository repository;

    public TeamMemberService(TeamMemberRepository repository) {
        this.repository = repository;
    }

    public TeamMemberEntity addMember(TeamMemberEntity member) {
        member.setName(safeTrim(member.getName()));
        member.setRole(safeTrim(member.getRole()));
        member.setBio(safeTrim(member.getBio()));
        member.setPhotoUrl(safeTrim(member.getPhotoUrl()));

        if (member.getCreatedAt() == null) {
            member.setCreatedAt(LocalDateTime.now());
        }

        return repository.save(member);
    }

    public TeamMemberEntity updateMember(String id, TeamMemberEntity updated) {
        TeamMemberEntity existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team member not found"));

        existing.setName(safeTrim(updated.getName()));
        existing.setRole(safeTrim(updated.getRole()));
        existing.setBio(safeTrim(updated.getBio()));
        existing.setPhotoUrl(safeTrim(updated.getPhotoUrl()));
        existing.setSocialLinks(updated.getSocialLinks());

        return repository.save(existing);
    }

    public TeamMemberEntity toggleMember(String id) {
        TeamMemberEntity member = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team member not found"));

        member.setActive(!member.isActive());
        return repository.save(member);
    }

    public List<TeamMemberEntity> getAllMembers() {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(
                        TeamMemberEntity::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();
    }

    public List<TeamMemberEntity> getActiveMembers() {
        return repository.findByActiveTrue().stream()
                .sorted(Comparator.comparing(
                        TeamMemberEntity::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();
    }

    public void deleteMember(String id) {
        TeamMemberEntity member = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team member not found"));
        repository.delete(member);
    }

    private String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }
}
