package com.librarymanagement.dto;

public class UserDashboardDTO {

    private long totalBooks;
    private long availableBooks;
    private long borrowedBooks;
    private long wishlistBooks;

    public UserDashboardDTO() {
    }

    public UserDashboardDTO(long totalBooks, long availableBooks, long borrowedBooks, long wishlistBooks) {
        this.totalBooks = totalBooks;
        this.availableBooks = availableBooks;
        this.borrowedBooks = borrowedBooks;
        this.wishlistBooks = wishlistBooks;
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

    public long getWishlistBooks() {
        return wishlistBooks;
    }

    public void setWishlistBooks(long wishlistBooks) {
        this.wishlistBooks = wishlistBooks;
    }
}
