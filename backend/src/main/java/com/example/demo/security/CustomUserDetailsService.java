package com.example.demo.security;

import com.example.demo.model.Utilisateur;
import com.example.demo.repository.UtilisateurRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UtilisateurRepository repository;

    public CustomUserDetailsService(UtilisateurRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Utilisateur u = repository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable"));

        return new User(u.getUsername(), u.getPassword(), List.of());
    }
}
