package com.example.expensetracker.service;

import com.example.expensetracker.dto.TransactionRequest;
import com.example.expensetracker.dto.TransactionResponse;
import com.example.expensetracker.entity.Transaction;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.enums.TransactionType;
import com.example.expensetracker.exception.ResourceNotFoundException;
import com.example.expensetracker.repository.TransactionRepository;
import com.example.expensetracker.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    // search/type/category are all optional. type is parsed defensively - an
    // invalid or unknown value is treated as "no filter" instead of a 400, since
    // it only narrows a GET list and never touches another user's data.
    public List<TransactionResponse> getTransactions(String email, String search, String type, String category) {
        User user = findUser(email);

        Specification<Transaction> spec = (root, query, cb) -> cb.equal(root.get("user"), user);

        if (search != null && !search.isBlank()) {
            String like = "%" + search.toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("description")), like),
                    cb.like(cb.lower(root.get("category")), like)
            ));
        }

        TransactionType parsedType = parseType(type);
        if (parsedType != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("type"), parsedType));
        }

        if (category != null && !category.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category"), category));
        }

        return transactionRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "transactionDate"))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TransactionResponse getById(String email, Long id) {
        User user = findUser(email);
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        return toResponse(transaction);
    }

    public TransactionResponse create(String email, TransactionRequest request) {
        User user = findUser(email);
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        applyRequest(transaction, request);
        return toResponse(transactionRepository.save(transaction));
    }

    public TransactionResponse update(String email, Long id, TransactionRequest request) {
        User user = findUser(email);
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        applyRequest(transaction, request);
        return toResponse(transactionRepository.save(transaction));
    }

    @Transactional
    public void delete(String email, Long id) {
        User user = findUser(email);
        transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        transactionRepository.deleteByIdAndUser(id, user);
    }

    private TransactionType parseType(String type) {
        if (type == null || type.isBlank()) {
            return null;
        }
        try {
            return TransactionType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }

    private void applyRequest(Transaction transaction, TransactionRequest request) {
        transaction.setType(request.getType());
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private TransactionResponse toResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getCategory(),
                transaction.getDescription(),
                transaction.getTransactionDate(),
                transaction.getCreatedAt()
        );
    }
}
