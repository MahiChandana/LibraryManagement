package com.librarymanagement.service;

import com.librarymanagement.dto.BorrowBookDTO;
import com.librarymanagement.dto.BorrowRequestDTO;
import java.util.List;

public interface BorrowBookService {
    BorrowBookDTO borrowBook(BorrowRequestDTO borrowRequestDTO);
    BorrowBookDTO returnBook(Long borrowId);
    List<BorrowBookDTO> getAllBorrows();
    List<BorrowBookDTO> getBorrowsByUser(Long userId);
    List<BorrowBookDTO> getBorrowsByBook(Long bookId);
}
