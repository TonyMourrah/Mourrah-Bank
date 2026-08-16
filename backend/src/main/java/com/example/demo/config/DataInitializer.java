package com.example.demo.config;

import com.example.demo.repository.EnveloppeRepository;
import com.example.demo.repository.UtilisateurRepository;
import com.example.demo.model.Utilisateur;
import com.example.demo.service.EnveloppeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    @Bean
    public CommandLineRunner initData(UtilisateurRepository userRepo,
                                       EnveloppeRepository enveloppeRepo,
                                       EnveloppeService enveloppeService,
                                       PasswordEncoder encoder) {
        return args -> {
            if (userRepo.findByUsername(adminUsername).isEmpty()) {
                Utilisateur u = new Utilisateur();
                u.setUsername(adminUsername);
                u.setPassword(encoder.encode(adminPassword));
                u.setRole("ADMIN");
                userRepo.save(u);
            }

            enveloppeService.creerReservoirNonAlloue(adminUsername);
        };
    }
}