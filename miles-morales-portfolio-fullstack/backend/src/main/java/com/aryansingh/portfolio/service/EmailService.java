package com.aryansingh.portfolio.service;

import com.aryansingh.portfolio.model.ContactMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Emails the site owner whenever someone submits the contact form, so a
 * recruiter's message lands directly in the inbox rather than depending on
 * the visitor's own mail client actually being configured and them hitting
 * send (which is what the frontend's mailto: fallback requires).
 *
 * Deliberately fail-soft: if SMTP isn't configured (SMTP_HOST unset) or the
 * send throws for any reason, this logs and returns — it never lets an email
 * problem turn into a failed contact-form submission. The message is always
 * safely persisted to the database by ContactController regardless.
 *
 * sendContactNotification runs on Spring's async executor (@Async, enabled by
 * @EnableAsync on PortfolioApplication) instead of the request thread. SMTP
 * relays (Gmail's included) can take several seconds — or hit the 5s
 * connect/read/write timeouts configured in MailConfig — and previously that
 * whole wait sat inside ContactController.submit() before it could return a
 * response, which is why the "send" button on the site would sometimes feel
 * stuck. Now the HTTP response goes back the moment the message is saved to
 * the database, and the email is sent in the background.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    // ObjectProvider, not a direct JavaMailSender dependency: Spring Boot only
    // registers a JavaMailSender bean when spring.mail.host is set, so a hard
    // constructor dependency on JavaMailSender would fail app startup
    // whenever SMTP isn't configured. ObjectProvider defers the lookup until
    // send time, so this service (and the whole app) boots fine either way.
    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final String smtpHost;
    private final String toEmail;
    private final String fromEmail;

    public EmailService(
            ObjectProvider<JavaMailSender> mailSenderProvider,
            @Value("${spring.mail.host:}") String smtpHost,
            @Value("${app.notify.to-email:}") String toEmail,
            @Value("${app.notify.from-email:}") String fromEmail
    ) {
        this.mailSenderProvider = mailSenderProvider;
        this.smtpHost = smtpHost;
        this.toEmail = toEmail;
        this.fromEmail = fromEmail;
    }

    @Async
    public void sendContactNotification(ContactMessage message) {
        if (smtpHost == null || smtpHost.isBlank() || toEmail == null || toEmail.isBlank()) {
            log.info(
                "SMTP_HOST or NOTIFY_TO_EMAIL not set — skipping email notification for "
                    + "contact message #{}. The message is still saved in the database.",
                message.getId()
            );
            return;
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            log.warn("spring.mail.host is set but no JavaMailSender bean is available — skipping "
                + "email notification for contact message #{}.", message.getId());
            return;
        }

        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(toEmail);
            if (fromEmail != null && !fromEmail.isBlank()) {
                mail.setFrom(fromEmail);
            }
            // Reply-To is the recruiter's own address, so hitting "Reply" in
            // your inbox goes straight back to them, not to the SMTP relay.
            mail.setReplyTo(message.getEmail());
            mail.setSubject("Portfolio inquiry from " + message.getName());
            mail.setText(
                "New message from your portfolio contact form:\n\n"
                    + "Name: " + message.getName() + "\n"
                    + "Email: " + message.getEmail() + "\n"
                    + "Submitted: " + message.getSubmittedAt() + "\n\n"
                    + "Message:\n" + message.getMessage() + "\n"
            );

            mailSender.send(mail);
            log.info("Emailed contact notification for message #{} to {}", message.getId(), toEmail);
        } catch (Exception e) {
            // Never propagate — a broken SMTP relay shouldn't turn into a
            // 500 for someone who just filled out the contact form, and by
            // this point the response has already been sent anyway.
            log.warn(
                "Failed to email contact notification for message #{}: {}",
                message.getId(),
                e.getMessage()
            );
        }
    }
}
