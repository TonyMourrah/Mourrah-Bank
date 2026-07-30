package com.example.demo.repository;

import com.example.demo.model.Compte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// JpaRepository  contient  les méthodes .save(), .findAll(), .findById(), etc.
@Repository
public interface CompteRepository extends JpaRepository<Compte, String> {

}
