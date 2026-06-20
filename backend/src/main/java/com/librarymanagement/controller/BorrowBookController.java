package com.librarymanagement.controller;

import com.librarymanagement.dto.BorrowBookDTO;
import com.librarymanagement.dto.BorrowRequestDTO;
import com.librarymanagement.service.BorrowBookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrow")
public class BorrowBookController {

    private final BorrowBookService borrowBookService;

    public BorrowBookController(BorrowBookService borrowBookService) {
        this.borrowBookService = borrowBookService;
    }

    @PostMapping
    public ResponseEntity<BorrowBookDTO> borrowBook(@Valid @RequestBody BorrowRequestDTO borrowRequestDTO) {
        BorrowBookDTO borrowRecord = borrowBookService.borrowBook(borrowRequestDTO);
        return new ResponseEntity<>(borrowRecord, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<BorrowBookDTO>> getAllBorrows() {
        List<BorrowBookDTO> borrows = borrowBookService.getAllBorrows();
        return ResponseEntity.ok(borrows);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BorrowBookDTO>> getBorrowsByUser(@PathVariable Long userId) {
        List<BorrowBookDTO> borrows = borrowBookService.getBorrowsByUser(userId);
        return ResponseEntity.ok(borrows);
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<BorrowBookDTO>> getBorrowsByBook(@PathVariable Long bookId) {
        List<BorrowBookDTO> borrows = borrowBookService.getBorrowsByBook(bookId);
        return ResponseEntity.ok(borrows);
    }

    @PutMapping("/return/{borrowId}")
    public ResponseEntity<BorrowBookDTO> returnBook(@PathVariable Long borrowId) {
        BorrowBookDTO updatedRecord = borrowBookService.returnBook(borrowId);
        return ResponseEntity.ok(updatedRecord);
    }
}
