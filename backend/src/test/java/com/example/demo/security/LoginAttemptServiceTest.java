package com.example.demo.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class LoginAttemptServiceTest {

    private LoginAttemptService loginAttemptService;
    private static final String USERNAME = "tony";

    @BeforeEach
    void setUp() {
        loginAttemptService = new LoginAttemptService();
    }

    @Nested
    @DisplayName("Comptage des tentatives")
    class ComptageTentatives {

        @Test
        @DisplayName("un utilisateur sans tentative échouée a 5 tentatives restantes")
        void aucune_tentative_echouee() {
            assertThat(loginAttemptService.getAttemptsRemaining(USERNAME)).isEqualTo(5);
            assertThat(loginAttemptService.isLocked(USERNAME)).isFalse();
        }

        @Test
        @DisplayName("chaque échec réduit le nombre de tentatives restantes")
        void chaque_echec_reduit_les_tentatives() {
            loginAttemptService.loginFailed(USERNAME);
            assertThat(loginAttemptService.getAttemptsRemaining(USERNAME)).isEqualTo(4);

            loginAttemptService.loginFailed(USERNAME);
            assertThat(loginAttemptService.getAttemptsRemaining(USERNAME)).isEqualTo(3);
        }

        @Test
        @DisplayName("une connexion réussie réinitialise le compteur de tentatives")
        void connexion_reussie_reinitialise_le_compteur() {
            loginAttemptService.loginFailed(USERNAME);
            loginAttemptService.loginFailed(USERNAME);
            assertThat(loginAttemptService.getAttemptsRemaining(USERNAME)).isEqualTo(3);

            loginAttemptService.loginSucceeded(USERNAME);

            assertThat(loginAttemptService.getAttemptsRemaining(USERNAME)).isEqualTo(5);
        }
    }

    @Nested
    @DisplayName("Verrouillage du compte")
    class Verrouillage {

        @Test
        @DisplayName("le compte est verrouillé après 5 tentatives échouées")
        void verrouillage_apres_5_echecs() {
            for (int i = 0; i < 5; i++) {
                loginAttemptService.loginFailed(USERNAME);
            }

            assertThat(loginAttemptService.isLocked(USERNAME)).isTrue();
            assertThat(loginAttemptService.getAttemptsRemaining(USERNAME)).isEqualTo(0);
        }

        @Test
        @DisplayName("le compte n'est pas encore verrouillé après seulement 4 échecs")
        void pas_de_verrouillage_avant_5_echecs() {
            for (int i = 0; i < 4; i++) {
                loginAttemptService.loginFailed(USERNAME);
            }

            assertThat(loginAttemptService.isLocked(USERNAME)).isFalse();
            assertThat(loginAttemptService.getAttemptsRemaining(USERNAME)).isEqualTo(1);
        }

        @Test
        @DisplayName("le temps de verrouillage restant est d'environ 15 minutes juste après le verrouillage")
        void temps_de_verrouillage_restant_correct() {
            for (int i = 0; i < 5; i++) {
                loginAttemptService.loginFailed(USERNAME);
            }

            long minutesRestantes = loginAttemptService.getRemainingLockoutMinutes(USERNAME);

            assertThat(minutesRestantes).isBetween(14L, 15L);
        }

        @Test
        @DisplayName("un utilisateur non verrouillé n'a aucun temps de verrouillage restant")
        void aucun_temps_restant_si_non_verrouille() {
            assertThat(loginAttemptService.getRemainingLockoutMinutes(USERNAME)).isEqualTo(0);
        }

        @Test
        @DisplayName("le verrouillage d'un utilisateur n'affecte pas un autre utilisateur")
        void verrouillage_isole_par_utilisateur() {
            for (int i = 0; i < 5; i++) {
                loginAttemptService.loginFailed(USERNAME);
            }

            assertThat(loginAttemptService.isLocked(USERNAME)).isTrue();
            assertThat(loginAttemptService.isLocked("alice")).isFalse();
        }
    }

    @Nested
    @DisplayName("Comptage des comptes verrouillés")
    class CompteVerrouilles {

        @Test
        @DisplayName("aucun compte verrouillé au départ")
        void aucun_compte_verrouille_par_defaut() {
            assertThat(loginAttemptService.getLockedAccountsCount()).isEqualTo(0);
        }

        @Test
        @DisplayName("compte correctement le nombre de comptes actuellement verrouillés")
        void compte_les_comptes_verrouilles() {
            for (int i = 0; i < 5; i++) {
                loginAttemptService.loginFailed("tony");
            }
            for (int i = 0; i < 5; i++) {
                loginAttemptService.loginFailed("alice");
            }
            loginAttemptService.loginFailed("bob");

            assertThat(loginAttemptService.getLockedAccountsCount()).isEqualTo(2);
        }
    }
}