package com.example.demo.controller;

import com.example.demo.model.Enveloppe;
import com.example.demo.model.Utilisateur;
import com.example.demo.repository.EnveloppeRepository;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UtilisateurRepository;
import com.example.demo.security.LoginAttemptService;
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
    private final EnveloppeRepository enveloppeRepository;
    private final TransactionRepository transactionRepository;
    private final LoginAttemptService loginAttemptService;

    public AdminController(UtilisateurRepository utilisateurRepository,
                            EnveloppeRepository enveloppeRepository,
                            TransactionRepository transactionRepository,
                            LoginAttemptService loginAttemptService) {
        this.utilisateurRepository = utilisateurRepository;
        this.enveloppeRepository = enveloppeRepository;
        this.transactionRepository = transactionRepository;
        this.loginAttemptService = loginAttemptService;
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

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        long totalUsers = utilisateurRepository.count();
        long admins = utilisateurRepository.findAll().stream()
                .filter(u -> "ADMIN".equals(u.getRole()))
                .count();

        List<Enveloppe> toutesEnveloppes = enveloppeRepository.findAll();
        List<Enveloppe> categories = toutesEnveloppes.stream()
                .filter(e -> !e.isNonAlloue())
                .collect(Collectors.toList());

        long budgetCount = categories.stream().filter(e -> "BUDGET".equals(e.getType())).count();
        long epargneCount = categories.stream().filter(e -> "EPARGNE".equals(e.getType())).count();

        double moyenneEnveloppesParUser = totalUsers > 0
                ? Math.round((double) categories.size() / totalUsers * 10) / 10.0
                : 0;

        long totalTransactions = transactionRepository.count();
        int comptesVerrouilles = loginAttemptService.getLockedAccountsCount();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalAdmins", admins);
        stats.put("totalClients", totalUsers - admins);
        stats.put("totalTransactions", totalTransactions);
        stats.put("moyenneEnveloppesParUser", moyenneEnveloppesParUser);
        stats.put("budgetCount", budgetCount);
        stats.put("epargneCount", epargneCount);
        stats.put("comptesVerrouilles", comptesVerrouilles);
        return stats;
    }
}