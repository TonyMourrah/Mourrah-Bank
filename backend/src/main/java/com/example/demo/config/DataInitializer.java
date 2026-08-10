package com.example.demo.config;

import com.example.demo.model.Enveloppe;
import com.example.demo.model.Utilisateur;
import com.example.demo.repository.EnveloppeRepository;
import com.example.demo.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Value("${admin.username:tony}")
    private String adminUsername;

    @Value("${admin.password:changeMoiEnLocal123456}")
    private String adminPassword;

    @Bean
    public CommandLineRunner initData(UtilisateurRepository userRepo,
                                       EnveloppeRepository enveloppeRepo,
                                       PasswordEncoder encoder) {
        return args -> {
            if (userRepo.findByUsername(adminUsername).isEmpty()) {
                Utilisateur u = new Utilisateur();
                u.setUsername(adminUsername);
                u.setPassword(encoder.encode(adminPassword));
                u.setRole("ADMIN");
                userRepo.save(u);
            }

            boolean nonAlloueExiste = enveloppeRepo.findAll().stream()
                    .anyMatch(Enveloppe::isNonAlloue);

            if (!nonAlloueExiste) {
                Enveloppe reservoir = new Enveloppe(
                        "NONALLOUE", "Non alloué", 0, 0, true, "BUDGET"
                );
                enveloppeRepo.save(reservoir);
            }
        };
    }
}