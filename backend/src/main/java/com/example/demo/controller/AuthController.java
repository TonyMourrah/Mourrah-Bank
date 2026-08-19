package com.example.demo.controller;

import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.Utilisateur;
import com.example.demo.repository.UtilisateurRepository;
import com.example.demo.security.CommonPasswordChecker;
import com.example.demo.security.JwtUtil;
import com.example.demo.security.LoginAttemptService;
import com.example.demo.service.EnveloppeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dto.ChangePasswordRequest;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final CommonPasswordChecker commonPasswordChecker;
    private final LoginAttemptService loginAttemptService;
    private final EnveloppeService enveloppeService;

    public AuthController(AuthenticationManager authManager, JwtUtil jwtUtil,
            UtilisateurRepository utilisateurRepository,
            PasswordEncoder passwordEncoder,
            CommonPasswordChecker commonPasswordChecker,
            LoginAttemptService loginAttemptService,
            EnveloppeService enveloppeService) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.commonPasswordChecker = commonPasswordChecker;
        this.loginAttemptService = loginAttemptService;
        this.enveloppeService = enveloppeService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        if (utilisateurRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(409).body("Ce nom d'utilisateur existe déjà");
        }

        if (commonPasswordChecker.isCommon(request.getPassword())) {
            return ResponseEntity.status(400).body("Ce mot de passe est trop commun, choisis-en un autre");
        }

        Utilisateur user = new Utilisateur();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("CLIENT");
        user.setEmailVerifie(true);
        utilisateurRepository.save(user);

        enveloppeService.creerReservoirNonAlloue(user.getUsername());

        return ResponseEntity.ok("Compte créé avec succès");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequest request) {
        String username = request.getUsername();

        if (loginAttemptService.isLocked(username)) {
            long minutes = loginAttemptService.getRemainingLockoutMinutes(username);
            return ResponseEntity.status(429).body(
                    "Trop de tentatives échouées. Réessaie dans " + minutes + " minute(s).");
        }

        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            username, request.getPassword()));

            loginAttemptService.loginSucceeded(username);

            Utilisateur user = utilisateurRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

            return ResponseEntity.ok(jwtUtil.generateToken(user.getUsername(), user.getRole()));
        } catch (AuthenticationException e) {
            loginAttemptService.loginFailed(username);
            int remaining = loginAttemptService.getAttemptsRemaining(username);

            if (remaining > 0) {
                return ResponseEntity.status(401).body(
                        "Identifiants incorrects. " + remaining + " tentative(s) restante(s).");
            } else {
                return ResponseEntity.status(429).body(
                        "Trop de tentatives échouées. Compte temporairement verrouillé.");
            }
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        Utilisateur user = utilisateurRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        Map<String, String> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("role", user.getRole());
        response.put("email", user.getEmail());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        Utilisateur user = utilisateurRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(400).body("Mot de passe actuel incorrect");
        }
        if (commonPasswordChecker.isCommon(request.getNewPassword())) {
            return ResponseEntity.status(400).body("Ce mot de passe est trop commun, choisis-en un autre");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        utilisateurRepository.save(user);
        return ResponseEntity.ok("Mot de passe modifié avec succès");
    }
}