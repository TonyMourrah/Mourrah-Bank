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

    // Créer une transaction
    public void enregistrer(String source, String dest, double montant, String desc) {
        Transaction t = new Transaction(source, dest, montant, desc);
        repository.save(t);
    }

    // Récupérer toutes les transactions
    public List<Transaction> listerTout() {
        return repository.findAll();
    }
}
