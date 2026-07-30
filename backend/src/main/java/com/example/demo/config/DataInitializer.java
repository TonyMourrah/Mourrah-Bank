package com.example.demo.config;

import com.example.demo.model.Utilisateur;
import com.example.demo.repository.UtilisateurRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
//Pour tester sans interface d'inscription
// ajoute un utilisateur par défaut au démarrage
@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UtilisateurRepository repo, PasswordEncoder encoder) {
        return args -> {
            if (repo.findByUsername("tony").isEmpty()) {
                Utilisateur u = new Utilisateur();
                u.setUsername("tony");
                u.setPassword(encoder.encode("password123"));
                u.setRole("ADMIN");
                repo.save(u);
            }
        };
    }
}
