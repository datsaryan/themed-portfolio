package com.aryansingh.portfolio.controller;

import com.aryansingh.portfolio.dto.ContactRequest;
import com.aryansingh.portfolio.dto.ContactResponse;
import com.aryansingh.portfolio.model.ContactMessage;
import com.aryansingh.portfolio.repository.ContactMessageRepository;
import com.aryansingh.portfolio.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactMessageRepository contactMessageRepository;
    private final EmailService emailService;

    @Value("${app.admin.api-key}")
    private String adminApiKey;

    public ContactController(ContactMessageRepository contactMessageRepository, EmailService emailService) {
        this.contactMessageRepository = contactMessageRepository;
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<ContactResponse> submit(@Valid @RequestBody ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setMessage(request.getMessage());
        message.setSubmittedAt(Instant.now());

        ContactMessage saved = contactMessageRepository.save(message);

        // Persisted first, emailed second: the submission is never lost even
        // if the SMTP relay is down or unconfigured.
        emailService.sendContactNotification(saved);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ContactResponse(saved.getId(), "received"));
    }

    /**
     * Lists submitted contact messages, newest first. Guarded by a shared
     * admin key so the inbox isn't publicly readable — pass it as the
     * X-Admin-Key header. Configure the expected value via the ADMIN_API_KEY
     * env var; the endpoint refuses all requests if it isn't set.
     */
    @GetMapping
    public ResponseEntity<List<ContactMessage>> list(
            @RequestHeader(name = "X-Admin-Key", required = false) String providedKey) {

        if (adminApiKey == null || adminApiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Admin key not configured on the server");
        }
        if (providedKey == null || !adminApiKey.equals(providedKey)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or missing X-Admin-Key");
        }

        List<ContactMessage> messages =
                contactMessageRepository.findAll(Sort.by(Sort.Direction.DESC, "submittedAt"));
        return ResponseEntity.ok(messages);
    }
}
