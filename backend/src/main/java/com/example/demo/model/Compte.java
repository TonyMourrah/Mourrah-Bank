package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity // une table SQL
public class Compte {
    @Id // Définit la clé primaire
    private String id;

    private String titulaire;
    private double solde;


    public Compte() {
    }


    public Compte(String id, String titulaire, double solde) {
        this.id = id;
        this.titulaire = titulaire;
        this.solde = solde;
    }

    // pour que Spring transforme l'objet en JSON on a besoin des getters
    public String getId() {
        return id;
    }
    public String getTitulaire() {
        return titulaire;
    }
    public double getSolde() {
        return solde;
    }


    public void setSolde(double s) {
        this.solde = s;
    }

    public void setTitulaire(String t) {

        this.titulaire = t;
    }
}