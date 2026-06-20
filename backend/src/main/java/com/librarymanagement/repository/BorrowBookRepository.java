package com.librarymanagement.repository;

import com.librarymanagement.entity.BorrowBook;
import com.librarymanagement.entity.BorrowStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowBookRepository extends JpaRepository<BorrowBook, Long> {

    List<BorrowBook> findByUserId(Long userId);

    List<BorrowBook> findByBookId(Long bookId);

    long countByStatus(BorrowStatus status);
}
