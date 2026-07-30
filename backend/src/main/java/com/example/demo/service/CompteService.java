package com.example.demo.service;

import com.example.demo.model.Compte;
import com.example.demo.model.Transaction;
import com.example.demo.repository.CompteRepository;
import com.example.demo.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CompteService {

    private final CompteRepository repository;
    private final TransactionService transactionService;

    public CompteService(CompteRepository repository, TransactionService transactionService) {
        this.repository = repository;
        this.transactionService = transactionService;
    }

    public List<Compte> obtenirTousLesComptes() {
        return repository.findAll();
    }

    public Compte sauvegarderCompte(Compte compte) {
        return repository.save(compte);
    }

    @Transactional // si le virement échoue  , l'argent n'est pas retiré du premier ( Rollback )
    public void virement(String idSource, String idDestination, double montant) {
        // trouver le compte source et le stocker
        Compte source = repository.findById(idSource)
                .orElseThrow(() -> new RuntimeException("Compte source introuvable"));
        // trouver le compte destination et le stocker
        Compte destination = repository.findById(idDestination)
                .orElseThrow(() -> new RuntimeException("Compte destination introuvable"));

        // Vérifier si le solde est suffisant
        if (source.getSolde() < montant) {
            throw new RuntimeException("Solde insuffisant !");
        }

        //  Logique de transfert
        source.setSolde(source.getSolde() - montant);
        destination.setSolde(destination.getSolde() + montant);

        // Sauvegarder les changements
        repository.save(source);
        repository.save(destination);


        // sauvegarder la transaction
        transactionService.enregistrer(idSource, idDestination, montant, "Virement Bancaire ");
    }

    public void supprimer(String id) {
        // vérifie si le compte existe avant de tenter de le supprimer
        if (!repository.existsById(id)) {
            throw new RuntimeException("Impossible de supprimer : Compte introuvable avec l'ID : " + id);
        }
        repository.deleteById(id);
    }
}