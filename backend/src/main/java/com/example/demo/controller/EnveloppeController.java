package com.example.demo.controller;

import com.example.demo.dto.EnveloppeUpdateRequest;
import com.example.demo.dto.ReallocationRequest;
import com.example.demo.model.Enveloppe;
import com.example.demo.service.EnveloppeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    public List<Enveloppe> getAll(Authentication authentication) {
        return enveloppeService.obtenirToutesLesEnveloppes(authentication.getName());
    }

    @PostMapping
    public ResponseEntity<?> postEnveloppe(@RequestBody Enveloppe nouvelleEnveloppe, Authentication authentication) {
        if (nouvelleEnveloppe.isNonAlloue()) {
            return ResponseEntity.status(409).body("Le réservoir non alloué existe déjà et est unique.");
        }
        return ResponseEntity.ok(enveloppeService.sauvegarderEnveloppe(nouvelleEnveloppe, authentication.getName()));
    }

    @PutMapping("/reallocation")
    public ResponseEntity<String> reallouer(@RequestBody ReallocationRequest request, Authentication authentication) {
        try {
            enveloppeService.reallouer(request.getFrom(), request.getTo(), request.getMontant(), authentication.getName());
            return ResponseEntity.ok("Réallocation effectuée avec succès");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEnveloppe(@PathVariable String id, @RequestBody EnveloppeUpdateRequest donnees, Authentication authentication) {
        try {
            return ResponseEntity.ok(enveloppeService.mettreAJour(id, donnees, authentication.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> supprimerEnveloppe(@PathVariable String id, Authentication authentication) {
        try {
            enveloppeService.supprimer(id, authentication.getName());
            return ResponseEntity.ok("Enveloppe supprimée");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}