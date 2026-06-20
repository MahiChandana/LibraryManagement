package com.librarymanagement.repository;

import com.librarymanagement.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    boolean existsByIsbn(String isbn);

    boolean existsByIsbnAndIdNot(String isbn, Long id);

    List<Book> findByCategoryIgnoreCase(String category);

    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Book> searchBooks(@Param("keyword") String keyword);

    @Query("SELECT SUM(b.availableCopies) FROM Book b")
    Long sumAvailableCopies();

    @Query("SELECT SUM(b.totalCopies) FROM Book b")
    Long sumTotalCopies();
}
