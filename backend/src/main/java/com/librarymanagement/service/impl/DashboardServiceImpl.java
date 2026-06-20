package com.librarymanagement.service.impl;

import com.librarymanagement.dto.DashboardDTO;
import com.librarymanagement.entity.BorrowStatus;
import com.librarymanagement.repository.BookRepository;
import com.librarymanagement.repository.BorrowBookRepository;
import com.librarymanagement.repository.UserRepository;
import com.librarymanagement.repository.WishListRepository;
import com.librarymanagement.service.DashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BorrowBookRepository borrowBookRepository;
    private final WishListRepository wishListRepository;

    public DashboardServiceImpl(BookRepository bookRepository,
                                UserRepository userRepository,
                                BorrowBookRepository borrowBookRepository,
                                WishListRepository wishListRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.borrowBookRepository = borrowBookRepository;
        this.wishListRepository = wishListRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardDTO getDashboardStats() {
        long totalBooks = bookRepository.count();
        long totalUsers = userRepository.count();
        long borrowedBooks = borrowBookRepository.countByStatus(BorrowStatus.BORROWED);

        long availableBooks = bookRepository.findAll().stream()
                .filter(b -> b.getAvailableCopies() > 0)
                .count();

        long wishlistBooks = wishListRepository.count();

        return new DashboardDTO(
                totalBooks,
                totalUsers,
                borrowedBooks,
                availableBooks,
                wishlistBooks
        );
    }

    @Override
    @Transactional(readOnly = true)
    public com.librarymanagement.dto.UserDashboardDTO getUserDashboardStats(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new com.librarymanagement.exception.ResourceNotFoundException("User not found with ID: " + userId);
        }

        long totalBooks = bookRepository.count();
        long availableBooks = bookRepository.findAll().stream()
                .filter(b -> b.getAvailableCopies() > 0)
                .count();

        long borrowedBooks = borrowBookRepository.findByUserId(userId).stream()
                .filter(b -> b.getStatus() == BorrowStatus.BORROWED)
                .count();

        long wishlistBooks = wishListRepository.findByUserId(userId).size();

        return new com.librarymanagement.dto.UserDashboardDTO(
                totalBooks,
                availableBooks,
                borrowedBooks,
                wishlistBooks
        );
    }
}
