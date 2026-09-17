package com.example.expensetracker.controller;

import com.example.expensetracker.dto.DashboardResponse;
import com.example.expensetracker.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardResponse> summary(Authentication authentication) {
        return ResponseEntity.ok(dashboardService.getSummary(authentication.getName()));
    }
}
