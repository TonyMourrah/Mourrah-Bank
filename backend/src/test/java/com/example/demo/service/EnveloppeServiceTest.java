package com.example.demo.service;

import com.example.demo.dto.EnveloppeUpdateRequest;
import com.example.demo.model.Enveloppe;
import com.example.demo.repository.EnveloppeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnveloppeServiceTest {

    @Mock
    private EnveloppeRepository repository;

    @Mock
    private TransactionService transactionService;

    @InjectMocks
    private EnveloppeService enveloppeService;

    private static final String USERNAME = "tony";
    private static final String AUTRE_USERNAME = "alice";

    private Enveloppe epicerie;
    private Enveloppe transport;

    @BeforeEach
    void setUp() {
        epicerie = new Enveloppe("E001", "Épicerie", 300.0, 300.0, false, "BUDGET");
        epicerie.setUtilisateurUsername(USERNAME);

        transport = new Enveloppe("E002", "Transport", 100.0, 150.0, false, "BUDGET");
        transport.setUtilisateurUsername(USERNAME);
    }

    @Nested
    @DisplayName("Réallocation entre enveloppes")
    class Reallocation {

        @Test
        @DisplayName("devrait transférer le montant correctement entre deux enveloppes du même utilisateur")
        void reallocation_reussie() {
            when(repository.findByIdAndUtilisateurUsername("E001", USERNAME)).thenReturn(Optional.of(epicerie));
            when(repository.findByIdAndUtilisateurUsername("E002", USERNAME)).thenReturn(Optional.of(transport));

            enveloppeService.reallouer("E001", "E002", 50.0, USERNAME);

            assertThat(epicerie.getMontant()).isEqualTo(250.0);
            assertThat(transport.getMontant()).isEqualTo(150.0);

            verify(repository).save(epicerie);
            verify(repository).save(transport);
            verify(transactionService).enregistrer("E001", "E002", 50.0, "Réallocation entre enveloppes", USERNAME);
        }

        @Test
        @DisplayName("devrait échouer si le montant de l'enveloppe source est insuffisant")
        void reallocation_echoue_si_solde_insuffisant() {
            when(repository.findByIdAndUtilisateurUsername("E001", USERNAME)).thenReturn(Optional.of(epicerie));
            when(repository.findByIdAndUtilisateurUsername("E002", USERNAME)).thenReturn(Optional.of(transport));

            RuntimeException exception = assertThrows(RuntimeException.class, () ->
                    enveloppeService.reallouer("E001", "E002", 9999.0, USERNAME)
            );

            assertThat(exception.getMessage()).isEqualTo("Montant insuffisant dans cette enveloppe !");
            verify(repository, never()).save(any());
            verify(transactionService, never()).enregistrer(any(), any(), anyDouble(), any(), any());
        }

        @Test
        @DisplayName("devrait échouer si l'enveloppe source est introuvable")
        void reallocation_echoue_si_source_introuvable() {
            when(repository.findByIdAndUtilisateurUsername("E999", USERNAME)).thenReturn(Optional.empty());

            RuntimeException exception = assertThrows(RuntimeException.class, () ->
                    enveloppeService.reallouer("E999", "E002", 50.0, USERNAME)
            );

            assertThat(exception.getMessage()).isEqualTo("Enveloppe source introuvable");
            verify(repository, never()).save(any());
        }

        @Test
        @DisplayName("devrait échouer si l'enveloppe destination est introuvable")
        void reallocation_echoue_si_destination_introuvable() {
            when(repository.findByIdAndUtilisateurUsername("E001", USERNAME)).thenReturn(Optional.of(epicerie));
            when(repository.findByIdAndUtilisateurUsername("E999", USERNAME)).thenReturn(Optional.empty());

            RuntimeException exception = assertThrows(RuntimeException.class, () ->
                    enveloppeService.reallouer("E001", "E999", 50.0, USERNAME)
            );

            assertThat(exception.getMessage()).isEqualTo("Enveloppe destination introuvable");
        }

        @Test
        @DisplayName("ne devrait jamais accéder à une enveloppe appartenant à un autre utilisateur")
        void reallocation_isolee_par_utilisateur() {
            when(repository.findByIdAndUtilisateurUsername("E001", AUTRE_USERNAME)).thenReturn(Optional.empty());

            assertThrows(RuntimeException.class, () ->
                    enveloppeService.reallouer("E001", "E002", 50.0, AUTRE_USERNAME)
            );

            verify(repository, never()).findByIdAndUtilisateurUsername(eq("E001"), eq(USERNAME));
        }
    }

    @Nested
    @DisplayName("Lecture des enveloppes")
    class Lecture {

        @Test
        @DisplayName("devrait retourner uniquement les enveloppes de l'utilisateur demandé")
        void obtenirToutesLesEnveloppes_filtre_par_utilisateur() {
            when(repository.findByUtilisateurUsername(USERNAME)).thenReturn(List.of(epicerie, transport));

            List<Enveloppe> resultat = enveloppeService.obtenirToutesLesEnveloppes(USERNAME);

            assertThat(resultat).hasSize(2);
            assertThat(resultat).allMatch(e -> e.getUtilisateurUsername().equals(USERNAME));
            verify(repository, never()).findAll();
        }
    }

    @Nested
    @DisplayName("Création et sauvegarde")
    class Creation {

        @Test
        @DisplayName("devrait assigner automatiquement l'utilisateur courant à une nouvelle enveloppe")
        void sauvegarderEnveloppe_assigne_utilisateur() {
            Enveloppe nouvelle = new Enveloppe("E003", "Loisirs", 0, 0, false, "BUDGET");
            when(repository.save(any(Enveloppe.class))).thenAnswer(inv -> inv.getArgument(0));

            ArgumentCaptor<Enveloppe> captor = ArgumentCaptor.forClass(Enveloppe.class);

            enveloppeService.sauvegarderEnveloppe(nouvelle, USERNAME);

            verify(repository).save(captor.capture());
            assertThat(captor.getValue().getUtilisateurUsername()).isEqualTo(USERNAME);
        }

        @Test
        @DisplayName("ne devrait pas créer de doublon du réservoir non alloué")
        void creerReservoirNonAlloue_evite_les_doublons() {
            Enveloppe reservoirExistant = new Enveloppe("NONALLOUE-tony", "Non alloué", 0, 0, true, "BUDGET");
            when(repository.findByUtilisateurUsername(USERNAME)).thenReturn(List.of(reservoirExistant));

            enveloppeService.creerReservoirNonAlloue(USERNAME);

            verify(repository, never()).save(any());
        }

        @Test
        @DisplayName("devrait créer le réservoir non alloué s'il n'existe pas encore")
        void creerReservoirNonAlloue_cree_si_absent() {
            when(repository.findByUtilisateurUsername(USERNAME)).thenReturn(List.of());

            enveloppeService.creerReservoirNonAlloue(USERNAME);

            ArgumentCaptor<Enveloppe> captor = ArgumentCaptor.forClass(Enveloppe.class);
            verify(repository).save(captor.capture());
            assertThat(captor.getValue().isNonAlloue()).isTrue();
            assertThat(captor.getValue().getUtilisateurUsername()).isEqualTo(USERNAME);
        }
    }

    @Nested
    @DisplayName("Modification")
    class Modification {

        @Test
        @DisplayName("devrait mettre à jour les champs d'une enveloppe existante")
        void mettreAJour_modifie_les_champs() {
            when(repository.findByIdAndUtilisateurUsername("E001", USERNAME)).thenReturn(Optional.of(epicerie));
            when(repository.save(any(Enveloppe.class))).thenAnswer(inv -> inv.getArgument(0));

            EnveloppeUpdateRequest requete = new EnveloppeUpdateRequest();
            requete.setNom("Épicerie modifiée");
            requete.setMontant(500.0);
            requete.setLimite(600.0);
            requete.setType("BUDGET");

            Enveloppe resultat = enveloppeService.mettreAJour("E001", requete, USERNAME);

            assertThat(resultat.getNom()).isEqualTo("Épicerie modifiée");
            assertThat(resultat.getMontant()).isEqualTo(500.0);
            assertThat(resultat.getLimite()).isEqualTo(600.0);
        }

        @Test
        @DisplayName("devrait échouer si l'enveloppe n'appartient pas à l'utilisateur")
        void mettreAJour_echoue_si_pas_proprietaire() {
            when(repository.findByIdAndUtilisateurUsername("E001", AUTRE_USERNAME)).thenReturn(Optional.empty());

            EnveloppeUpdateRequest requete = new EnveloppeUpdateRequest();

            assertThrows(RuntimeException.class, () ->
                    enveloppeService.mettreAJour("E001", requete, AUTRE_USERNAME)
            );
        }
    }
}