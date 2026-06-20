package com.librarymanagement.service.impl;

import com.librarymanagement.dto.BorrowBookDTO;
import com.librarymanagement.dto.WishListDTO;
import com.librarymanagement.dto.WishListRequestDTO;
import com.librarymanagement.entity.Book;
import com.librarymanagement.entity.BorrowBook;
import com.librarymanagement.entity.BorrowStatus;
import com.librarymanagement.entity.User;
import com.librarymanagement.entity.WishList;
import com.librarymanagement.exception.BadRequestException;
import com.librarymanagement.exception.ResourceNotFoundException;
import com.librarymanagement.repository.BookRepository;
import com.librarymanagement.repository.BorrowBookRepository;
import com.librarymanagement.repository.UserRepository;
import com.librarymanagement.repository.WishListRepository;
import com.librarymanagement.service.WishListService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishListServiceImpl implements WishListService {

    private final WishListRepository wishListRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final BorrowBookRepository borrowBookRepository;

    public WishListServiceImpl(WishListRepository wishListRepository,
                                UserRepository userRepository,
                                BookRepository bookRepository,
                                BorrowBookRepository borrowBookRepository) {
        this.wishListRepository = wishListRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.borrowBookRepository = borrowBookRepository;
    }

    @Override
    @Transactional
    public WishListDTO addToWishList(WishListRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getUserId()));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + request.getBookId()));

        if (wishListRepository.existsByUserIdAndBookId(request.getUserId(), request.getBookId())) {
            throw new BadRequestException("Book '" + book.getTitle() + "' is already in user's wishlist.");
        }

        WishList wishList = new WishList();
        wishList.setUser(user);
        wishList.setBook(book);
        wishList.setAddedDate(LocalDateTime.now());

        WishList savedWishList = wishListRepository.save(wishList);
        return mapToDTO(savedWishList);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WishListDTO> getWishListByUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }
        return wishListRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteFromWishList(Long wishlistId) {
        WishList wishList = wishListRepository.findById(wishlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist record not found with ID: " + wishlistId));
        wishListRepository.delete(wishList);
    }

    @Override
    @Transactional
    public BorrowBookDTO moveWishListToBorrowed(Long wishlistId) {
        WishList wishList = wishListRepository.findById(wishlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist record not found with ID: " + wishlistId));

        User user = wishList.getUser();
        Book book = wishList.getBook();

        if (book.getAvailableCopies() <= 0) {
            throw new BadRequestException("Book '" + book.getTitle() + "' has no available copies and cannot be borrowed at this time.");
        }

        // Decrement copies
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        // Create borrow record (default due date 14 days from now)
        BorrowBook borrowRecord = new BorrowBook();
        borrowRecord.setUser(user);
        borrowRecord.setBook(book);
        borrowRecord.setBorrowDate(LocalDateTime.now());
        borrowRecord.setDueDate(LocalDateTime.now().plusDays(14));
        borrowRecord.setStatus(BorrowStatus.BORROWED);

        BorrowBook savedBorrowRecord = borrowBookRepository.save(borrowRecord);

        // Remove from wishlist
        wishListRepository.delete(wishList);

        // Convert and return
        BorrowBookDTO dto = new BorrowBookDTO();
        dto.setId(savedBorrowRecord.getId());
        dto.setUserId(savedBorrowRecord.getUser().getId());
        dto.setUserName(savedBorrowRecord.getUser().getName());
        dto.setBookId(savedBorrowRecord.getBook().getId());
        dto.setBookTitle(savedBorrowRecord.getBook().getTitle());
        dto.setBorrowDate(savedBorrowRecord.getBorrowDate());
        dto.setDueDate(savedBorrowRecord.getDueDate());
        dto.setReturnDate(savedBorrowRecord.getReturnDate());
        dto.setStatus(savedBorrowRecord.getStatus().name());
        
        return dto;
    }

    private WishListDTO mapToDTO(WishList wishList) {
        WishListDTO dto = new WishListDTO();
        dto.setId(wishList.getId());
        dto.setUserId(wishList.getUser().getId());
        dto.setUserName(wishList.getUser().getName());
        dto.setBookId(wishList.getBook().getId());
        dto.setBookTitle(wishList.getBook().getTitle());
        dto.setBookAuthor(wishList.getBook().getAuthor());
        dto.setAddedDate(wishList.getAddedDate());
        dto.setBookAvailable(wishList.getBook().getAvailableCopies() > 0);
        return dto;
    }
}
