package com.librarymanagement.controller;

import com.librarymanagement.dto.DashboardDTO;
import com.librarymanagement.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardDTO> getDashboardStats() {
        DashboardDTO stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<com.librarymanagement.dto.UserDashboardDTO> getUserDashboardStats(@PathVariable Long userId) {
        com.librarymanagement.dto.UserDashboardDTO stats = dashboardService.getUserDashboardStats(userId);
        return ResponseEntity.ok(stats);
    }
}
