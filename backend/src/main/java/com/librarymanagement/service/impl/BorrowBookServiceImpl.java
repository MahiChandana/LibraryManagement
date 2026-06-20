package com.librarymanagement.service.impl;

import com.librarymanagement.dto.BorrowBookDTO;
import com.librarymanagement.dto.BorrowRequestDTO;
import com.librarymanagement.entity.Book;
import com.librarymanagement.entity.BorrowBook;
import com.librarymanagement.entity.BorrowStatus;
import com.librarymanagement.entity.User;
import com.librarymanagement.exception.BadRequestException;
import com.librarymanagement.exception.ResourceNotFoundException;
import com.librarymanagement.repository.BookRepository;
import com.librarymanagement.repository.BorrowBookRepository;
import com.librarymanagement.repository.UserRepository;
import com.librarymanagement.service.BorrowBookService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BorrowBookServiceImpl implements BorrowBookService {

    private final BorrowBookRepository borrowBookRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public BorrowBookServiceImpl(BorrowBookRepository borrowBookRepository,
                                  UserRepository userRepository,
                                  BookRepository bookRepository) {
        this.borrowBookRepository = borrowBookRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    @Transactional
    public BorrowBookDTO borrowBook(BorrowRequestDTO borrowRequestDTO) {
        User user = userRepository.findById(borrowRequestDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + borrowRequestDTO.getUserId()));

        Book book = bookRepository.findById(borrowRequestDTO.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + borrowRequestDTO.getBookId()));

        if (book.getAvailableCopies() <= 0) {
            throw new BadRequestException("Book '" + book.getTitle() + "' is currently out of stock (no available copies).");
        }

        LocalDateTime dueDate = borrowRequestDTO.getDueDate();
        if (dueDate == null) {
            dueDate = LocalDateTime.now().plusDays(14);
        } else if (dueDate.isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Due date cannot be in the past.");
        }

        // Decrement copies
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        BorrowBook borrowRecord = new BorrowBook();
        borrowRecord.setUser(user);
        borrowRecord.setBook(book);
        borrowRecord.setBorrowDate(LocalDateTime.now());
        borrowRecord.setDueDate(dueDate);
        borrowRecord.setStatus(BorrowStatus.BORROWED);

        BorrowBook savedRecord = borrowBookRepository.save(borrowRecord);
        return mapToDTO(savedRecord);
    }

    @Override
    @Transactional
    public BorrowBookDTO returnBook(Long borrowId) {
        BorrowBook borrowRecord = borrowBookRepository.findById(borrowId)
                .orElseThrow(() -> new ResourceNotFoundException("Borrow record not found with ID: " + borrowId));

        if (borrowRecord.getStatus() == BorrowStatus.RETURNED) {
            throw new BadRequestException("This book has already been returned.");
        }

        Book book = borrowRecord.getBook();
        
        // Increment copies
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        borrowRecord.setStatus(BorrowStatus.RETURNED);
        borrowRecord.setReturnDate(LocalDateTime.now());

        BorrowBook updatedRecord = borrowBookRepository.save(borrowRecord);
        return mapToDTO(updatedRecord);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BorrowBookDTO> getAllBorrows() {
        return borrowBookRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BorrowBookDTO> getBorrowsByUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }
        return borrowBookRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BorrowBookDTO> getBorrowsByBook(Long bookId) {
        if (!bookRepository.existsById(bookId)) {
            throw new ResourceNotFoundException("Book not found with ID: " + bookId);
        }
        return borrowBookRepository.findByBookId(bookId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private BorrowBookDTO mapToDTO(BorrowBook record) {
        BorrowBookDTO dto = new BorrowBookDTO();
        dto.setId(record.getId());
        dto.setUserId(record.getUser().getId());
        dto.setUserName(record.getUser().getName());
        dto.setBookId(record.getBook().getId());
        dto.setBookTitle(record.getBook().getTitle());
        dto.setBorrowDate(record.getBorrowDate());
        dto.setDueDate(record.getDueDate());
        dto.setReturnDate(record.getReturnDate());
        dto.setStatus(record.getStatus().name());
        return dto;
    }
}
