package com.example.demo.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // génére des id
    private Long id;

    private String compteSourceId;
    private String compteDestinationId;
    private double montant;
    private LocalDateTime dateTransaction;
    private String description;


    public Transaction() {}

    public Transaction(String source, String destination, double montant, String description) {
        this.compteSourceId = source;
        this.compteDestinationId = destination;
        this.montant = montant;
        this.description = description;
        this.dateTransaction = LocalDateTime.now();
    }

    public String getCompteSourceId() { return compteSourceId; }
    public String getCompteDestinationId() { return compteDestinationId; }
    public double getMontant() { return montant; }
    public LocalDateTime getDateTransaction() { return dateTransaction; }
    public String getDescription() { return description; }

}
