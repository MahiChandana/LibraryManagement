package com.librarymanagement.repository;

import com.librarymanagement.entity.WishList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishListRepository extends JpaRepository<WishList, Long> {

    List<WishList> findByUserId(Long userId);

    boolean existsByUserIdAndBookId(Long userId, Long bookId);

    Optional<WishList> findByUserIdAndBookId(Long userId, Long bookId);
}
