package com.example.demo.repository;

import com.example.demo.model.Enveloppe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnveloppeRepository extends JpaRepository<Enveloppe, String> {
}