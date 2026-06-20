package com.librarymanagement.service;

import com.librarymanagement.dto.BookDTO;
import java.util.List;

public interface BookService {
    BookDTO createBook(BookDTO bookDTO);
    List<BookDTO> getAllBooks();
    BookDTO getBookById(Long id);
    BookDTO updateBook(Long id, BookDTO bookDTO);
    void deleteBook(Long id);
    List<BookDTO> searchBooks(String keyword);
    List<BookDTO> getBooksByCategory(String category);
}
