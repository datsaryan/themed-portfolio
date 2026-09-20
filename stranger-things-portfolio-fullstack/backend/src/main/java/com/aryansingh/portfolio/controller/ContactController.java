package com.aryansingh.portfolio.controller;

import com.aryansingh.portfolio.dto.ContactRequest;
import com.aryansingh.portfolio.dto.ContactResponse;
import com.aryansingh.portfolio.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    private final ContactService service;
    public ContactController(ContactService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<ContactResponse> sendMessage(@Valid @RequestBody ContactRequest req) {
        return ResponseEntity.ok(service.saveMessage(req));
    }
}
