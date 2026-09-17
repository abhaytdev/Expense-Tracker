package com.example.expensetracker.service;

import com.example.expensetracker.dto.DashboardResponse;
import com.example.expensetracker.dto.TransactionResponse;
import com.example.expensetracker.entity.Transaction;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.enums.TransactionType;
import com.example.expensetracker.exception.ResourceNotFoundException;
import com.example.expensetracker.repository.TransactionRepository;
import com.example.expensetracker.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public DashboardService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public DashboardResponse getSummary(String email) {
        User user = findUser(email);
        List<Transaction> transactions = transactionRepository.findByUser(
                user, Sort.by(Sort.Direction.DESC, "transactionDate"));

        BigDecimal totalIncome = sumByType(transactions, TransactionType.INCOME);
        BigDecimal totalExpense = sumByType(transactions, TransactionType.EXPENSE);
        BigDecimal balance = totalIncome.subtract(totalExpense);

        List<TransactionResponse> recent = transactions.stream()
                .limit(5)
                .map(this::toResponse)
                .collect(Collectors.toList());

        DashboardResponse response = new DashboardResponse();
        response.setTotalIncome(totalIncome);
        response.setTotalExpense(totalExpense);
        response.setBalance(balance);
        response.setTotalTransactions(transactions.size());
        response.setRecentTransactions(recent);
        return response;
    }

    private BigDecimal sumByType(List<Transaction> transactions, TransactionType type) {
        return transactions.stream()
                .filter(t -> t.getType() == type)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
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
