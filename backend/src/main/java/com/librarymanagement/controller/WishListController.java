package com.librarymanagement.controller;

import com.librarymanagement.dto.BorrowBookDTO;
import com.librarymanagement.dto.WishListDTO;
import com.librarymanagement.dto.WishListRequestDTO;
import com.librarymanagement.service.WishListService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishListController {

    private final WishListService wishListService;

    public WishListController(WishListService wishListService) {
        this.wishListService = wishListService;
    }

    @PostMapping
    public ResponseEntity<WishListDTO> addToWishList(@Valid @RequestBody WishListRequestDTO request) {
        WishListDTO wishListItem = wishListService.addToWishList(request);
        return new ResponseEntity<>(wishListItem, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WishListDTO>> getWishListByUser(@PathVariable Long userId) {
        List<WishListDTO> wishlist = wishListService.getWishListByUser(userId);
        return ResponseEntity.ok(wishlist);
    }

    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<Void> deleteFromWishList(@PathVariable Long wishlistId) {
        wishListService.deleteFromWishList(wishlistId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/borrow/{wishlistId}")
    public ResponseEntity<BorrowBookDTO> moveWishListToBorrowed(@PathVariable Long wishlistId) {
        BorrowBookDTO borrowRecord = wishListService.moveWishListToBorrowed(wishlistId);
        return new ResponseEntity<>(borrowRecord, HttpStatus.CREATED);
    }
}
