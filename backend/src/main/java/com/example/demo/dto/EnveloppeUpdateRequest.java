package com.example.demo.dto;

public class EnveloppeUpdateRequest {
    private String nom;
    private double montant;
    private double limite;
    private String type;

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public double getMontant() { return montant; }
    public void setMontant(double montant) { this.montant = montant; }

    public double getLimite() { return limite; }
    public void setLimite(double limite) { this.limite = limite; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}