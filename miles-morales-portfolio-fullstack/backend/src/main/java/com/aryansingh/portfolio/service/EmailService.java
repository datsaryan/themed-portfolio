package com.aryansingh.portfolio.service;

import com.aryansingh.portfolio.dto.ContactRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String toEmail;
    private final String fromEmail;
    private final String smtpHost;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${app.notify.to-email:aryansobdh@gmail.com}") String toEmail,
            @Value("${app.notify.from-email:}") String fromEmail,
            @Value("${spring.mail.host:}") String smtpHost
    ) {
        this.mailSender = mailSender;
        this.toEmail = toEmail;
        this.fromEmail = fromEmail;
        this.smtpHost = smtpHost;
    }

    public boolean isConfigured() {
        return smtpHost != null && !smtpHost.isBlank() && toEmail != null && !toEmail.isBlank();
    }

    public void sendContactNotification(ContactRequest request) {
        if (!isConfigured()) {
            log.info("SMTP host not configured; skipping email notification for message from {}", request.getEmail());
            return;
        }

        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(toEmail);
            if (fromEmail != null && !fromEmail.isBlank()) {
                mail.setFrom(fromEmail);
            }
            mail.setReplyTo(request.getEmail());
            mail.setSubject("Hawkins Signal: New Portfolio Transmission from " + request.getName());
            mail.setText("New transmission received on the portfolio portal:\n\n"
                    + "Name: " + request.getName() + "\n"
                    + "Email: " + request.getEmail() + "\n"
                    + "Message:\n" + request.getMessage() + "\n\n"
                    + "--\nHawkins Telecommunications Network");

            mailSender.send(mail);
            log.info("Email notification successfully dispatched to {}", toEmail);
        } catch (Exception e) {
            log.warn("Failed to dispatch email notification: {}", e.getMessage());
        }
    }
}
