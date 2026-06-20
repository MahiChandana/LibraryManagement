package com.librarymanagement.service;

import com.librarymanagement.dto.DashboardDTO;
import com.librarymanagement.dto.UserDashboardDTO;

public interface DashboardService {
    DashboardDTO getDashboardStats();
    UserDashboardDTO getUserDashboardStats(Long userId);
}
