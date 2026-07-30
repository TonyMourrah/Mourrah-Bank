package com.example.demo.controller;

import com.example.demo.dto.VirementRequest;
import com.example.demo.model.Compte;
import com.example.demo.service.CompteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/comptes")
public class CompteController {

    private final CompteService compteService;

    public CompteController(CompteService compteService) {
        this.compteService = compteService;
    }

    @GetMapping
    public List<Compte> getAll() {
        return compteService.obtenirTousLesComptes();
    }
    @PostMapping
    public Compte postCompte(@RequestBody Compte nouveauCompte) {
        return compteService.sauvegarderCompte(nouveauCompte);
    }
    @PutMapping("/virement")
    public ResponseEntity<String> effectuerVirement(@RequestBody VirementRequest request) {
        compteService.virement(request.getFrom(), request.getTo(), request.getMontant());
        return ResponseEntity.ok("Virement effectué avec succès");
    }


    @DeleteMapping("/{id}")
    public void supprimerCompte(@PathVariable String id) {
        compteService.supprimer(id);
    }
}