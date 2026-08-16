package com.example.demo.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String compteSourceId;
    private String compteDestinationId;
    private double montant;
    private LocalDateTime dateTransaction;
    private String description;
    private String utilisateurUsername;

    public Transaction() {}

    public Transaction(String source, String destination, double montant, String description, String utilisateurUsername) {
        this.compteSourceId = source;
        this.compteDestinationId = destination;
        this.montant = montant;
        this.description = description;
        this.dateTransaction = LocalDateTime.now();
        this.utilisateurUsername = utilisateurUsername;
    }

    public String getCompteSourceId() { return compteSourceId; }
    public String getCompteDestinationId() { return compteDestinationId; }
    public double getMontant() { return montant; }
    public LocalDateTime getDateTransaction() { return dateTransaction; }
    public String getDescription() { return description; }
    public String getUtilisateurUsername() { return utilisateurUsername; }
}