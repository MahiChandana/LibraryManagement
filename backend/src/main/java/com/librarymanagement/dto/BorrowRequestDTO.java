package com.librarymanagement.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class BorrowRequestDTO {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Book ID is required")
    private Long bookId;

    private LocalDateTime dueDate;

    public BorrowRequestDTO() {
    }

    public BorrowRequestDTO(Long userId, Long bookId, LocalDateTime dueDate) {
        this.userId = userId;
        this.bookId = bookId;
        this.dueDate = dueDate;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }
}
