package com.aryansingh.portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

// @EnableAsync makes EmailService's @Async contact-notification send run on a
// background thread instead of the request thread, so a slow/unreachable
// SMTP relay can never delay the contact form's HTTP response.
@EnableAsync
@SpringBootApplication
public class PortfolioApplication {
    public static void main(String[] args) {
        SpringApplication.run(PortfolioApplication.class, args);
    }
}
