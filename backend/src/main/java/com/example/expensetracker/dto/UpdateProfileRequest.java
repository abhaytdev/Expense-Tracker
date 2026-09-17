package com.example.expensetracker.dto;

import jakarta.validation.constraints.NotBlank;

// Only the display name can be changed here. Email is kept read-only because it is
// also the session login identifier — changing it mid-session would strand the
// current session (it would no longer match any user record). A real "change email"
// flow would need re-authentication, which is out of scope for this project.
public class UpdateProfileRequest {

    @NotBlank(message = "Name is required")
    private String name;

    public UpdateProfileRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
