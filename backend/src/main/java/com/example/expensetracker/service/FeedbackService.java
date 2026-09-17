package com.example.expensetracker.service;

import com.example.expensetracker.dto.FeedbackRequest;
import com.example.expensetracker.entity.Feedback;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.exception.ResourceNotFoundException;
import com.example.expensetracker.repository.FeedbackRepository;
import com.example.expensetracker.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public FeedbackService(FeedbackRepository feedbackRepository, UserRepository userRepository) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
    }

    public void submit(String email, FeedbackRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Feedback feedback = new Feedback();
        feedback.setUser(user);
        feedback.setMessage(request.getMessage());
        feedbackRepository.save(feedback);
    }
}
