package com.example.demo.dto;
/** Au lieu de retourner directement mon entité Compte (qui est liée à JPA/base de données),
 *  je retournes un objet propre et contrôlé.
 * Si demain tu ajoutes un champ sensible dans Compte (ex: motDePasse),
 * il n'apparaîtra jamais dans la réponse JSON car CompteDTO ne l'a pas
 *
 * Tu contrôles exactement ce que le client voit **/
public class CompteDTO {
    private String id;
    private String titulaire;
    private double solde;


    public CompteDTO(String id, String titulaire, double solde) {
        this.id = id;
        this.titulaire = titulaire;
        this.solde = solde;
    }

    public String getId() { return id; }
    public String getTitulaire() { return titulaire; }
    public double getSolde() { return solde; }
}
