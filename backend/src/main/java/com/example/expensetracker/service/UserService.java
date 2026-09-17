package com.example.expensetracker.service;

import com.example.expensetracker.dto.UpdateProfileRequest;
import com.example.expensetracker.dto.UserResponse;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.exception.ResourceNotFoundException;
import com.example.expensetracker.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse getProfile(String email) {
        return toResponse(findUser(email));
    }

    // Name only - email is the login identifier tied to the current session,
    // so it is intentionally not editable here. See UpdateProfileRequest.
    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = findUser(email);
        user.setName(request.getName());
        return toResponse(userRepository.save(user));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getCreatedAt());
    }
}
