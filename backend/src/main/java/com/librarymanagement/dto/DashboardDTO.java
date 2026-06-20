package com.librarymanagement.dto;

public class DashboardDTO {

    private long totalBooks;
    private long totalUsers;
    private long borrowedBooks;
    private long availableBooks;
    private long wishlistBooks;

    public DashboardDTO() {
    }

    public DashboardDTO(long totalBooks, long totalUsers, long borrowedBooks, long availableBooks, long wishlistBooks) {
        this.totalBooks = totalBooks;
        this.totalUsers = totalUsers;
        this.borrowedBooks = borrowedBooks;
        this.availableBooks = availableBooks;
        this.wishlistBooks = wishlistBooks;
    }

    public long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getBorrowedBooks() {
        return borrowedBooks;
    }

    public void setBorrowedBooks(long borrowedBooks) {
        this.borrowedBooks = borrowedBooks;
    }

    public long getAvailableBooks() {
        return availableBooks;
    }

    public void setAvailableBooks(long availableBooks) {
        this.availableBooks = availableBooks;
    }

    public long getWishlistBooks() {
        return wishlistBooks;
    }

    public void setWishlistBooks(long wishlistBooks) {
        this.wishlistBooks = wishlistBooks;
    }
}
