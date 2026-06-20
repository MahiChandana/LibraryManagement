package com.librarymanagement.service;

import com.librarymanagement.dto.BorrowBookDTO;
import com.librarymanagement.dto.WishListDTO;
import com.librarymanagement.dto.WishListRequestDTO;
import java.util.List;

public interface WishListService {
    WishListDTO addToWishList(WishListRequestDTO wishListRequestDTO);
    List<WishListDTO> getWishListByUser(Long userId);
    void deleteFromWishList(Long wishlistId);
    BorrowBookDTO moveWishListToBorrowed(Long wishlistId);
}
