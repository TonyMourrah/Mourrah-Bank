package com.example.demo.service;

import com.example.demo.model.Enveloppe;
import com.example.demo.repository.EnveloppeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EnveloppeService {

    private final EnveloppeRepository repository;
    private final TransactionService transactionService;

    public EnveloppeService(EnveloppeRepository repository, TransactionService transactionService) {
        this.repository = repository;
        this.transactionService = transactionService;
    }

    public List<Enveloppe> obtenirToutesLesEnveloppes(String username) {
        return repository.findByUtilisateurUsername(username);
    }

    public Enveloppe sauvegarderEnveloppe(Enveloppe enveloppe, String username) {
        enveloppe.setUtilisateurUsername(username);
        return repository.save(enveloppe);
    }

    @Transactional
    public void reallouer(String idSource, String idDestination, double montant, String username) {
        Enveloppe source = repository.findByIdAndUtilisateurUsername(idSource, username)
                .orElseThrow(() -> new RuntimeException("Enveloppe source introuvable"));
        Enveloppe destination = repository.findByIdAndUtilisateurUsername(idDestination, username)
                .orElseThrow(() -> new RuntimeException("Enveloppe destination introuvable"));

        if (source.getMontant() < montant) {
            throw new RuntimeException("Montant insuffisant dans cette enveloppe !");
        }

        source.setMontant(source.getMontant() - montant);
        destination.setMontant(destination.getMontant() + montant);

        repository.save(source);
        repository.save(destination);

transactionService.enregistrer(idSource, idDestination, montant, "Réallocation entre enveloppes", username);    }

    public Enveloppe mettreAJour(String id, com.example.demo.dto.EnveloppeUpdateRequest donnees, String username) {
        Enveloppe existante = repository.findByIdAndUtilisateurUsername(id, username)
                .orElseThrow(() -> new RuntimeException("Enveloppe introuvable"));

        existante.setNom(donnees.getNom());
        existante.setMontant(donnees.getMontant());
        existante.setLimite(donnees.getLimite());
        existante.setType(donnees.getType());

        return repository.save(existante);
    }

    public void supprimer(String id, String username) {
        Enveloppe existante = repository.findByIdAndUtilisateurUsername(id, username)
                .orElseThrow(() -> new RuntimeException("Enveloppe introuvable"));
        repository.delete(existante);
    }

    public void creerReservoirNonAlloue(String username) {
        boolean existe = repository.findByUtilisateurUsername(username).stream()
                .anyMatch(Enveloppe::isNonAlloue);

        if (!existe) {
            Enveloppe reservoir = new Enveloppe(
                    "NONALLOUE-" + username, "Non alloué", 0, 0, true, "BUDGET"
            );
            reservoir.setUtilisateurUsername(username);
            repository.save(reservoir);
        }
    }
}