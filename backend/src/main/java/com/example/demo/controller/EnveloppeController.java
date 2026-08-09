package com.example.demo.controller;

import com.example.demo.dto.ReallocationRequest;
import com.example.demo.model.Enveloppe;
import com.example.demo.service.EnveloppeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enveloppes")
public class EnveloppeController {

    private final EnveloppeService enveloppeService;

    public EnveloppeController(EnveloppeService enveloppeService) {
        this.enveloppeService = enveloppeService;
    }

    @GetMapping
    public List<Enveloppe> getAll() {
        return enveloppeService.obtenirToutesLesEnveloppes();
    }

    @PostMapping
    public ResponseEntity<?> postEnveloppe(@RequestBody Enveloppe nouvelleEnveloppe) {
        if (nouvelleEnveloppe.isNonAlloue()) {
            return ResponseEntity.status(409).body("Le réservoir non alloué existe déjà et est unique.");
        }
        return ResponseEntity.ok(enveloppeService.sauvegarderEnveloppe(nouvelleEnveloppe));
    }

    @PutMapping("/reallocation")
    public ResponseEntity<String> reallouer(@RequestBody ReallocationRequest request) {
        enveloppeService.reallouer(request.getFrom(), request.getTo(), request.getMontant());
        return ResponseEntity.ok("Réallocation effectuée avec succès");
    }

    @DeleteMapping("/{id}")
    public void supprimerEnveloppe(@PathVariable String id) {
        enveloppeService.supprimer(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEnveloppe(@PathVariable String id, @RequestBody Enveloppe donnees) {
        try {
            return ResponseEntity.ok(enveloppeService.mettreAJour(id, donnees));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}