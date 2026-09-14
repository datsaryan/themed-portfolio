package com.aryansingh.portfolio.controller;

import com.aryansingh.portfolio.dto.ContactRequest;
import com.aryansingh.portfolio.dto.ContactResponse;
import com.aryansingh.portfolio.model.ContactMessage;
import com.aryansingh.portfolio.repository.ContactMessageRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactMessageRepository contactMessageRepository;

    public ContactController(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    @PostMapping
    public ResponseEntity<ContactResponse> submit(@Valid @RequestBody ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setMessage(request.getMessage());
        message.setSubmittedAt(Instant.now());

        ContactMessage saved = contactMessageRepository.save(message);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ContactResponse(saved.getId(), "received"));
    }
}
