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

    public List<Enveloppe> obtenirToutesLesEnveloppes() {
        return repository.findAll();
    }

    public Enveloppe sauvegarderEnveloppe(Enveloppe enveloppe) {
        return repository.save(enveloppe);
    }

    @Transactional
    public void reallouer(String idSource, String idDestination, double montant) {
        Enveloppe source = repository.findById(idSource)
                .orElseThrow(() -> new RuntimeException("Enveloppe source introuvable"));
        Enveloppe destination = repository.findById(idDestination)
                .orElseThrow(() -> new RuntimeException("Enveloppe destination introuvable"));

        if (source.getMontant() < montant) {
            throw new RuntimeException("Montant insuffisant dans cette enveloppe !");
        }

        source.setMontant(source.getMontant() - montant);
        destination.setMontant(destination.getMontant() + montant);

        repository.save(source);
        repository.save(destination);

        transactionService.enregistrer(idSource, idDestination, montant, "Réallocation entre enveloppes");
    }

    public void supprimer(String id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Impossible de supprimer : Enveloppe introuvable avec l'ID : " + id);
        }
        repository.deleteById(id);
    }
}