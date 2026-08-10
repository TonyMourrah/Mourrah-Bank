package com.example.demo.controller;

import com.example.demo.model.Utilisateur;
import com.example.demo.repository.UtilisateurRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UtilisateurRepository utilisateurRepository;

    public AdminController(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @GetMapping("/users")
    public List<Map<String, Object>> getAllUsers() {
        return utilisateurRepository.findAll().stream().map(u -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("username", u.getUsername());
            m.put("role", u.getRole());
            return m;
        }).collect(Collectors.toList());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<String> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        String newRole = body.get("role");
        if (!"ADMIN".equals(newRole) && !"CLIENT".equals(newRole)) {
            return ResponseEntity.status(400).body("Rôle invalide");
        }

        u.setRole(newRole);
        utilisateurRepository.save(u);
        return ResponseEntity.ok("Rôle mis à jour");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id, Authentication authentication) {
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (u.getUsername().equals(authentication.getName())) {
            return ResponseEntity.status(400).body("Tu ne peux pas supprimer ton propre compte");
        }

        utilisateurRepository.deleteById(id);
        return ResponseEntity.ok("Utilisateur supprimé");
    }
}