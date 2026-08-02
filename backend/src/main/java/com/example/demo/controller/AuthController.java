package com.example.demo.controller;

import com.example.demo.dto.AuthRequest;
import com.example.demo.model.Utilisateur;
import com.example.demo.repository.UtilisateurRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UtilisateurRepository utilisateurRepository;

    public AuthController(AuthenticationManager authManager, JwtUtil jwtUtil,
                           UtilisateurRepository utilisateurRepository) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.utilisateurRepository = utilisateurRepository;
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