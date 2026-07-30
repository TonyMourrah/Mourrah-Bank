/**  package com.example.demo.service;

import com.example.demo.model.Compte;
import com.example.demo.repository.CompteRepository;
import com.example.demo.service.CompteService;
import com.example.demo.service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class CompteServiceTest {

    @Mock
    private CompteRepository repository;

    @Mock
    private TransactionService transactionService;

    @InjectMocks
    private CompteService compteService;

    private Compte source;
    private Compte destination;

    @BeforeEach
    void setUp() {
        source = new Compte("C001", "Tony", 1000.0);
        destination = new Compte("C002", "Alice", 500.0);
    }

    // ✅ Test 1 — Virement normal
    @Test
    void virement_devrait_transferer_le_montant() {
        when(repository.findById("C001")).thenReturn(Optional.of(source));
        when(repository.findById("C002")).thenReturn(Optional.of(destination));

        compteService.virement("C001", "C002", 200.0);

        assertEquals(800.0, source.getSolde());
        assertEquals(700.0, destination.getSolde());
        verify(repository, times(2)).save(any(Compte.class));
    }

    // ❌ Test 2 — Solde insuffisant
    @Test
    void virement_devrait_echouer_si_solde_insuffisant() {
        when(repository.findById("C001")).thenReturn(Optional.of(source));
        when(repository.findById("C002")).thenReturn(Optional.of(destination));

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                compteService.virement("C001", "C002", 9999.0)
        );

        assertEquals("Solde insuffisant !", exception.getMessage());
        verify(repository, never()).save(any()); // aucune sauvegarde ne doit avoir lieu
    }

    // ❌ Test 3 — Compte source inexistant
    @Test
    void virement_devrait_echouer_si_compte_source_introuvable() {
        when(repository.findById("C999")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                compteService.virement("C999", "C002", 100.0)
        );

        assertEquals("Compte source introuvable", exception.getMessage());
    }

    // ❌ Test 4 — Compte destination inexistant
    @Test
    void virement_devrait_echouer_si_compte_destination_introuvable() {
        when(repository.findById("C001")).thenReturn(Optional.of(source));
        when(repository.findById("C999")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                compteService.virement("C001", "C999", 100.0)
        );

        assertEquals("Compte destination introuvable", exception.getMessage());
    }
}
 **/