package com.example.expensetracker.repository;

import com.example.expensetracker.entity.Transaction;
import com.example.expensetracker.entity.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

// JpaSpecificationExecutor gives us findAll(Specification, Sort) for the
// search/type/category filtering used by TransactionService - no need to
// declare that method explicitly, it comes from the interface.
public interface TransactionRepository extends JpaRepository<Transaction, Long>,
        JpaSpecificationExecutor<Transaction> {

    List<Transaction> findByUser(User user, Sort sort);

    Optional<Transaction> findByIdAndUser(Long id, User user);

    void deleteByIdAndUser(Long id, User user);
}
