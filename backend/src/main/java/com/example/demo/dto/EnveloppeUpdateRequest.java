package com.example.demo.dto;

public class EnveloppeUpdateRequest {
    private String nom;
    private double montant;
    private double limite;
    private String type;

    public String getNom() { return nom; }
    public double getMontant() { return montant; }
    public double getLimite() { return limite; }
    public String getType() { return type; }
}