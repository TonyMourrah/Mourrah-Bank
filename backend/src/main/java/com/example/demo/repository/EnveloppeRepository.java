package com.example.demo.repository;

import com.example.demo.model.Enveloppe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnveloppeRepository extends JpaRepository<Enveloppe, String> {
    List<Enveloppe> findByUtilisateurUsername(String username);
    Optional<Enveloppe> findByIdAndUtilisateurUsername(String id, String username);
}