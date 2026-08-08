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
    public Enveloppe postEnveloppe(@RequestBody Enveloppe nouvelleEnveloppe) {
        return enveloppeService.sauvegarderEnveloppe(nouvelleEnveloppe);
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
}