package com.example.expensetracker.controller;

import com.example.expensetracker.dto.FeedbackRequest;
import com.example.expensetracker.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<Void> submit(Authentication authentication, @Valid @RequestBody FeedbackRequest request) {
        feedbackService.submit(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
