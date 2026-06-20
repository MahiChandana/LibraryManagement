package com.librarymanagement.dto;

import java.util.Map;

public class ReportDTO {

    private long totalBooks;
    private long availableBooks;
    private long borrowedBooks;
    private long overdueBooks;
    private long totalUsers;
    private long wishlistCount;
    private Map<String, Long> categoryCounts;
    private Map<String, Long> monthlyTrends;

    public ReportDTO() {
    }

    public ReportDTO(long totalBooks, long availableBooks, long borrowedBooks, long overdueBooks, 
                     long totalUsers, long wishlistCount, Map<String, Long> categoryCounts, Map<String, Long> monthlyTrends) {
        this.totalBooks = totalBooks;
        this.availableBooks = availableBooks;
        this.borrowedBooks = borrowedBooks;
        this.overdueBooks = overdueBooks;
        this.totalUsers = totalUsers;
        this.wishlistCount = wishlistCount;
        this.categoryCounts = categoryCounts;
        this.monthlyTrends = monthlyTrends;
    }

    public long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public long getAvailableBooks() {
        return availableBooks;
    }

    public void setAvailableBooks(long availableBooks) {
        this.availableBooks = availableBooks;
    }

    public long getBorrowedBooks() {
        return borrowedBooks;
    }

    public void setBorrowedBooks(long borrowedBooks) {
        this.borrowedBooks = borrowedBooks;
    }

    public long getOverdueBooks() {
        return overdueBooks;
    }

    public void setOverdueBooks(long overdueBooks) {
        this.overdueBooks = overdueBooks;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getWishlistCount() {
        return wishlistCount;
    }

    public void setWishlistCount(long wishlistCount) {
        this.wishlistCount = wishlistCount;
    }

    public Map<String, Long> getCategoryCounts() {
        return categoryCounts;
    }

    public void setCategoryCounts(Map<String, Long> categoryCounts) {
        this.categoryCounts = categoryCounts;
    }

    public Map<String, Long> getMonthlyTrends() {
        return monthlyTrends;
    }

    public void setMonthlyTrends(Map<String, Long> monthlyTrends) {
        this.monthlyTrends = monthlyTrends;
    }
}
