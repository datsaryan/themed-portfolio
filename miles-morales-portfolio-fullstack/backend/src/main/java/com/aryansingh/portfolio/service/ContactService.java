package com.aryansingh.portfolio.service;

import com.aryansingh.portfolio.dto.ContactRequest;
import com.aryansingh.portfolio.dto.ContactResponse;
import com.aryansingh.portfolio.model.ContactMessage;
import com.aryansingh.portfolio.repository.ContactMessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final ContactMessageRepository contactMessageRepository;
    private final EmailService emailService;

    public ContactService(ContactMessageRepository contactMessageRepository, EmailService emailService) {
        this.contactMessageRepository = contactMessageRepository;
        this.emailService = emailService;
    }

    @Transactional
    public ContactResponse submitContact(ContactRequest request) {
        log.info("Received contact form submission from: {} ({})", request.getName(), request.getEmail());

        ContactMessage entity = new ContactMessage(
                request.getName(),
                request.getEmail(),
                request.getMessage()
        );
        entity.setSubmittedAt(java.time.Instant.now());
        ContactMessage saved = contactMessageRepository.save(entity);

        emailService.sendContactNotification(request);

        return new ContactResponse(
                saved.getId(),
                "Transmission successfully received and logged in Hawkins central archives."
        );
    }

    @Transactional(readOnly = true)
    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAll();
    }
}
