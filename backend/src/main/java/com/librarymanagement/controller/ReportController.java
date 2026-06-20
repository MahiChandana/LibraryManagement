package com.librarymanagement.controller;

import com.librarymanagement.dto.ReportDTO;
import com.librarymanagement.entity.Book;
import com.librarymanagement.entity.BorrowBook;
import com.librarymanagement.entity.BorrowStatus;
import com.librarymanagement.repository.BookRepository;
import com.librarymanagement.repository.BorrowBookRepository;
import com.librarymanagement.repository.UserRepository;
import com.librarymanagement.repository.WishListRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BorrowBookRepository borrowBookRepository;
    private final WishListRepository wishListRepository;

    public ReportController(BookRepository bookRepository,
                            UserRepository userRepository,
                            BorrowBookRepository borrowBookRepository,
                            WishListRepository wishListRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.borrowBookRepository = borrowBookRepository;
        this.wishListRepository = wishListRepository;
    }

    @GetMapping
    public ResponseEntity<ReportDTO> getReport() {
        long totalBooks = bookRepository.count();

        long availableBooks = bookRepository.findAll().stream()
                .filter(b -> b.getAvailableCopies() > 0)
                .count();

        long borrowedBooks = borrowBookRepository.countByStatus(BorrowStatus.BORROWED);
        long totalUsers = userRepository.count();
        long wishlistCount = wishListRepository.count();

        // Calculate Overdue Books
        List<BorrowBook> allBorrows = borrowBookRepository.findAll();
        long overdueBooks = allBorrows.stream()
                .filter(b -> b.getStatus() == BorrowStatus.BORROWED && b.getDueDate().isBefore(LocalDateTime.now()))
                .count();

        // Calculate Category Counts (Unique books or total copies per category, let's do unique book titles per category)
        List<Book> allBooks = bookRepository.findAll();
        Map<String, Long> categoryCounts = allBooks.stream()
                .collect(Collectors.groupingBy(
                        Book::getCategory,
                        Collectors.counting()
                ));

        // Calculate Monthly Trends (Lexicographically ordered YYYY-MM)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        Map<String, Long> monthlyTrends = new TreeMap<>();
        for (BorrowBook borrow : allBorrows) {
            if (borrow.getBorrowDate() != null) {
                String key = borrow.getBorrowDate().format(formatter);
                monthlyTrends.put(key, monthlyTrends.getOrDefault(key, 0L) + 1L);
            }
        }

        // Fallback for monthly trends if empty to look nice on charts
        if (monthlyTrends.isEmpty()) {
            monthlyTrends.put(LocalDateTime.now().minusMonths(2).format(formatter), 0L);
            monthlyTrends.put(LocalDateTime.now().minusMonths(1).format(formatter), 0L);
            monthlyTrends.put(LocalDateTime.now().format(formatter), 0L);
        }

        ReportDTO report = new ReportDTO(
                totalBooks,
                availableBooks,
                borrowedBooks,
                overdueBooks,
                totalUsers,
                wishlistCount,
                categoryCounts,
                monthlyTrends
        );

        return ResponseEntity.ok(report);
    }
}
