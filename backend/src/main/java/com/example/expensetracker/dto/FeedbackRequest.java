package com.example.expensetracker.dto;

import jakarta.validation.constraints.NotBlank;

public class FeedbackRequest {

    @NotBlank(message = "Feedback message is required")
    private String message;

    public FeedbackRequest() {
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
