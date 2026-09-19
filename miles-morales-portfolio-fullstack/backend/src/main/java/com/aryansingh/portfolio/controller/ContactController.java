package com.aryansingh.portfolio.controller;

import com.aryansingh.portfolio.dto.ContactRequest;
import com.aryansingh.portfolio.dto.ContactResponse;
import com.aryansingh.portfolio.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<ContactResponse> submitContact(@Valid @RequestBody ContactRequest request) {
        ContactResponse response = contactService.submitContact(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
