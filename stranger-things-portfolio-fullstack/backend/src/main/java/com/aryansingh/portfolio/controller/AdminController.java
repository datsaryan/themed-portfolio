package com.aryansingh.portfolio.controller;

import com.aryansingh.portfolio.dto.AdminStatsResponse;
import com.aryansingh.portfolio.model.ContactMessage;
import com.aryansingh.portfolio.service.AdminService;
import com.aryansingh.portfolio.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AdminService adminService;
    private final ContactService contactService;

    public AdminController(AdminService adminService, ContactService contactService) {
        this.adminService = adminService;
        this.contactService = contactService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/transmissions")
    public ResponseEntity<List<ContactMessage>> getTransmissions() {
        return ResponseEntity.ok(contactService.getAllMessages());
    }

    @PatchMapping("/transmissions/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable Long id) {
        contactService.markRead(id);
        return ResponseEntity.noContent().build();
    }
}
