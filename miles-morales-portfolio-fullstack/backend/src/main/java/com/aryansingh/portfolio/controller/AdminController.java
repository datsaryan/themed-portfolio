package com.aryansingh.portfolio.controller;

import com.aryansingh.portfolio.dto.AdminStatsResponse;
import com.aryansingh.portfolio.model.ContactMessage;
import com.aryansingh.portfolio.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/messages")
    public ResponseEntity<List<ContactMessage>> getTransmissions() {
        return ResponseEntity.ok(adminService.getAllTransmissions());
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }
}
