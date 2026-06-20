package com.librarymanagement.service.impl;

import com.librarymanagement.dto.BookDTO;
import com.librarymanagement.entity.Book;
import com.librarymanagement.exception.BadRequestException;
import com.librarymanagement.exception.ResourceNotFoundException;
import com.librarymanagement.repository.BookRepository;
import com.librarymanagement.service.BookService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    @Transactional
    public BookDTO createBook(BookDTO bookDTO) {
        if (bookRepository.existsByIsbn(bookDTO.getIsbn())) {
            throw new BadRequestException("A book with ISBN " + bookDTO.getIsbn() + " already exists.");
        }

        Book book = new Book();
        book.setTitle(bookDTO.getTitle());
        book.setAuthor(bookDTO.getAuthor());
        book.setIsbn(bookDTO.getIsbn());
        book.setCategory(bookDTO.getCategory());
        book.setDescription(bookDTO.getDescription());
        book.setTotalCopies(bookDTO.getTotalCopies());
        
        // If available copies not specified, default to total copies
        if (bookDTO.getAvailableCopies() == null) {
            book.setAvailableCopies(bookDTO.getTotalCopies());
        } else {
            if (bookDTO.getAvailableCopies() > bookDTO.getTotalCopies()) {
                throw new BadRequestException("Available copies cannot exceed total copies");
            }
            book.setAvailableCopies(bookDTO.getAvailableCopies());
        }
        
        book.setPublicationYear(bookDTO.getPublicationYear());

        Book savedBook = bookRepository.save(book);
        return mapToDTO(savedBook);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookDTO> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BookDTO getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + id));
        return mapToDTO(book);
    }

    @Override
    @Transactional
    public BookDTO updateBook(Long id, BookDTO bookDTO) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + id));

        if (bookRepository.existsByIsbnAndIdNot(bookDTO.getIsbn(), id)) {
            throw new BadRequestException("Another book with ISBN " + bookDTO.getIsbn() + " already exists.");
        }

        // Adjust available copies based on change in total copies
        int totalCopiesDiff = bookDTO.getTotalCopies() - book.getTotalCopies();
        int newAvailableCopies = book.getAvailableCopies() + totalCopiesDiff;
        if (newAvailableCopies < 0) {
            throw new BadRequestException("Cannot reduce total copies below the number of currently borrowed copies.");
        }

        book.setTitle(bookDTO.getTitle());
        book.setAuthor(bookDTO.getAuthor());
        book.setIsbn(bookDTO.getIsbn());
        book.setCategory(bookDTO.getCategory());
        book.setDescription(bookDTO.getDescription());
        book.setTotalCopies(bookDTO.getTotalCopies());
        book.setAvailableCopies(newAvailableCopies);
        book.setPublicationYear(bookDTO.getPublicationYear());

        Book updatedBook = bookRepository.save(book);
        return mapToDTO(updatedBook);
    }

    @Override
    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + id));
        
        if (book.getAvailableCopies() < book.getTotalCopies()) {
            throw new BadRequestException("Cannot delete book as some copies are currently borrowed.");
        }
        
        bookRepository.delete(book);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookDTO> searchBooks(String keyword) {
        return bookRepository.searchBooks(keyword).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookDTO> getBooksByCategory(String category) {
        return bookRepository.findByCategoryIgnoreCase(category).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private BookDTO mapToDTO(Book book) {
        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setIsbn(book.getIsbn());
        dto.setCategory(book.getCategory());
        dto.setDescription(book.getDescription());
        dto.setTotalCopies(book.getTotalCopies());
        dto.setAvailableCopies(book.getAvailableCopies());
        dto.setPublicationYear(book.getPublicationYear());
        dto.setCreatedAt(book.getCreatedAt());
        return dto;
    }
}
