package com.librarymanagement.controller;

import com.librarymanagement.dto.AuthResponseDTO;
import com.librarymanagement.dto.LoginRequestDTO;
import com.librarymanagement.dto.SignupRequestDTO;
import com.librarymanagement.entity.User;
import com.librarymanagement.exception.BadRequestException;
import com.librarymanagement.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword();

        if ("librarian@library.com".equals(email) && "admin123".equals(password)) {
            AuthResponseDTO response = new AuthResponseDTO(
                    999L,
                    "Library Admin",
                    "librarian@library.com",
                    "LIBRARIAN",
                    "mock-jwt-token-librarian"
            );
            return ResponseEntity.ok(response);
        } else if ("user@library.com".equals(email) && "user123".equals(password)) {
            // Find or create the user in database to support live data operations
            User user = userRepository.findByEmail("user@library.com").orElseGet(() -> {
                User newUser = new User();
                newUser.setName("Library User");
                newUser.setEmail("user@library.com");
                newUser.setPassword("user123");
                newUser.setPhone("1234567890");
                newUser.setAddress("Demo Address");
                newUser.setCreatedAt(LocalDateTime.now());
                return userRepository.save(newUser);
            });

            AuthResponseDTO response = new AuthResponseDTO(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    "USER",
                    "mock-jwt-token-user"
            );
            return ResponseEntity.ok(response);
        } else {
            // Check database for registered users
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new BadRequestException("Invalid email or password."));

            if (user.getPassword() != null && user.getPassword().equals(password)) {
                AuthResponseDTO response = new AuthResponseDTO(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        "USER",
                        "mock-jwt-token-" + user.getId()
                );
                return ResponseEntity.ok(response);
            } else {
                throw new BadRequestException("Invalid email or password.");
            }
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody SignupRequestDTO request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email) || "librarian@library.com".equals(email)) {
            throw new BadRequestException("A user with this email address already exists.");
        }

        User newUser = new User();
        newUser.setName(request.getName().trim());
        newUser.setEmail(email);
        newUser.setPassword(request.getPassword());
        newUser.setPhone(""); // optional/empty default
        newUser.setAddress(""); // optional/empty default
        newUser.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(newUser);

        AuthResponseDTO response = new AuthResponseDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                "USER",
                "mock-jwt-token-" + savedUser.getId()
        );
        return ResponseEntity.ok(response);
    }
}
