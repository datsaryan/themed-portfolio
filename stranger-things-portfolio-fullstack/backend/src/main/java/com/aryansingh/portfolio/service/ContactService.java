package com.aryansingh.portfolio.service;

import com.aryansingh.portfolio.dto.ContactRequest;
import com.aryansingh.portfolio.dto.ContactResponse;
import com.aryansingh.portfolio.model.ContactMessage;
import com.aryansingh.portfolio.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ContactService {
    private final ContactMessageRepository repo;

    public ContactService(ContactMessageRepository repo) { this.repo = repo; }

    public ContactResponse saveMessage(ContactRequest req) {
        ContactMessage msg = new ContactMessage(
            req.getSenderName(), req.getSenderEmail(), req.getSubject(), req.getMessage()
        );
        ContactMessage saved = repo.save(msg);
        return new ContactResponse(saved.getId(), "MESSAGE_RECEIVED");
    }

    public List<ContactMessage> getAllMessages() { return repo.findAllByOrderBySubmittedAtDesc(); }

    public long countUnread() { return repo.countByIsReadFalse(); }

    public void markRead(Long id) {
        repo.findById(id).ifPresent(m -> { m.setRead(true); repo.save(m); });
    }
}
