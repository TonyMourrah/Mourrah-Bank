package com.example.demo.service;

import com.example.demo.model.Transaction;
import com.example.demo.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }

    public void enregistrer(String source, String dest, double montant, String desc, String username) {
        Transaction t = new Transaction(source, dest, montant, desc, username);
        repository.save(t);
    }

    public List<Transaction> listerTout(String username) {
        return repository.findByUtilisateurUsernameOrderByDateTransactionDesc(username);
    }
}