package com.example.expensetracker.controller;

import com.example.expensetracker.dto.TransactionRequest;
import com.example.expensetracker.dto.TransactionResponse;
import com.example.expensetracker.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAll(
            Authentication authentication,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(transactionService.getTransactions(authentication.getName(), search, type, category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getOne(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getById(authentication.getName(), id));
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> create(Authentication authentication,
                                                        @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transactionService.create(authentication.getName(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> update(Authentication authentication, @PathVariable Long id,
                                                        @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.update(authentication.getName(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long id) {
        transactionService.delete(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
