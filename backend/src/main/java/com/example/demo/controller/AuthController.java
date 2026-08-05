package com.example.demo.controller;

import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.Utilisateur;
import com.example.demo.repository.UtilisateurRepository;
import com.example.demo.security.CommonPasswordChecker;
import com.example.demo.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final CommonPasswordChecker commonPasswordChecker;

    public AuthController(AuthenticationManager authManager, JwtUtil jwtUtil,
                           UtilisateurRepository utilisateurRepository,
                           PasswordEncoder passwordEncoder,
                           CommonPasswordChecker commonPasswordChecker) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.commonPasswordChecker = commonPasswordChecker;
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
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("CLIENT");
        utilisateurRepository.save(user);

        return ResponseEntity.ok("Compte créé avec succès");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequest request) {
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(), request.getPassword()
                    )
            );

            Utilisateur user = utilisateurRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

            return ResponseEntity.ok(jwtUtil.generateToken(user.getUsername(), user.getRole()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Identifiants incorrects");
        }
    }
}