package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Enveloppe {
    @Id
    private String id;

    private String nom;
    private double montant;

    public Enveloppe() {
    }

    public Enveloppe(String id, String nom, double montant) {
        this.id = id;
        this.nom = nom;
        this.montant = montant;
    }

    public String getId() {
        return id;
    }
    public String getNom() {
        return nom;
    }
    public double getMontant() {
        return montant;
    }

    public void setMontant(double m) {
        this.montant = m;
    }

    public void setNom(String n) {
        this.nom = n;
    }
}