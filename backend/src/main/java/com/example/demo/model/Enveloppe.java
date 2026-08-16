package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Enveloppe {
    @Id
    private String id;

    private String nom;
    private double montant;
    private double limite;
    private boolean nonAlloue;
    private String type;
    private String utilisateurUsername;

    public Enveloppe() {
    }

    public Enveloppe(String id, String nom, double montant, double limite, boolean nonAlloue, String type) {
        this.id = id;
        this.nom = nom;
        this.montant = montant;
        this.limite = limite;
        this.nonAlloue = nonAlloue;
        this.type = type;
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
    public double getLimite() {
        return limite;
    }
    public boolean isNonAlloue() {
        return nonAlloue;
    }
    public String getType() {
        return type;
    }
    public String getUtilisateurUsername() {
        return utilisateurUsername;
    }

    public void setMontant(double m) {
        this.montant = m;
    }
    public void setNom(String n) {
        this.nom = n;
    }
    public void setLimite(double l) {
        this.limite = l;
    }
    public void setNonAlloue(boolean nonAlloue) {
        this.nonAlloue = nonAlloue;
    }
    public void setType(String type) {
        this.type = type;
    }
    public void setUtilisateurUsername(String utilisateurUsername) {
        this.utilisateurUsername = utilisateurUsername;
    }
}