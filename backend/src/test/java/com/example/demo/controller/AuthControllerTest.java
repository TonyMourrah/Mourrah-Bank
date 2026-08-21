package com.example.demo.controller;

import com.example.demo.model.Utilisateur;
import com.example.demo.repository.UtilisateurRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String TEST_USERNAME = "testuser_authcontroller";
    private static final String TEST_PASSWORD = "motDePasseValide123";

    @BeforeEach
    void setUp() {
        utilisateurRepository.findByUsername(TEST_USERNAME)
                .ifPresent(utilisateurRepository::delete);

        Utilisateur user = new Utilisateur();
        user.setUsername(TEST_USERNAME);
        user.setPassword(passwordEncoder.encode(TEST_PASSWORD));
        user.setRole("CLIENT");
        utilisateurRepository.save(user);
    }

    private Map<String, String> authBody(String username, String password) {
        Map<String, String> body = new HashMap<>();
        body.put("username", username);
        body.put("password", password);
        return body;
    }

    @Nested
    @DisplayName("POST /api/auth/login")
    class Login {

        @Test
        @DisplayName("devrait retourner un token JWT avec des identifiants valides")
        void login_reussi_retourne_token() throws Exception {
            mockMvc.perform(post("/api/auth/login")
                    .contentType("application/json")
                    .content(objectMapper.writeValueAsString(authBody(TEST_USERNAME, TEST_PASSWORD))))
                    .andExpect(status().isOk())
                    .andExpect(content().string(containsString(".")));
        }

        @Test
        @DisplayName("devrait retourner 401 avec un mauvais mot de passe")
        void login_echoue_avec_mauvais_mot_de_passe() throws Exception {
            mockMvc.perform(post("/api/auth/login")
                    .contentType("application/json")
                    .content(objectMapper.writeValueAsString(authBody(TEST_USERNAME, "mauvaisMotDePasse"))))
                    .andExpect(status().isUnauthorized())
                    .andExpect(content().string(containsString("tentative")));
        }

        @Test
        @DisplayName("devrait verrouiller le compte après 5 tentatives échouées")
        void login_verrouille_apres_5_echecs() throws Exception {
            String uniqueUser = "lockout_test_user";
            utilisateurRepository.findByUsername(uniqueUser).ifPresent(utilisateurRepository::delete);
            Utilisateur user = new Utilisateur();
            user.setUsername(uniqueUser);
            user.setPassword(passwordEncoder.encode(TEST_PASSWORD));
            user.setRole("CLIENT");
            utilisateurRepository.save(user);

            for (int i = 0; i < 5; i++) {
                mockMvc.perform(post("/api/auth/login")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(authBody(uniqueUser, "mauvaisMotDePasse"))));
            }

            mockMvc.perform(post("/api/auth/login")
                    .contentType("application/json")
                    .content(objectMapper.writeValueAsString(authBody(uniqueUser, TEST_PASSWORD))))
                    .andExpect(status().isTooManyRequests())
                    .andExpect(content().string(containsString("tentatives")));

            utilisateurRepository.delete(user);
        }
    }

    @Nested
    @DisplayName("POST /api/auth/register")
    class Register {

        private Map<String, String> registerBody(String username, String email, String password) {
            Map<String, String> body = new HashMap<>();
            body.put("username", username);
            body.put("email", email);
            body.put("password", password);
            return body;
        }

        @Test
        @DisplayName("devrait créer un compte avec des données valides")
        void register_reussi() throws Exception {
            String newUsername = "nouveau_user_" + System.currentTimeMillis();
            utilisateurRepository.findByUsername(newUsername).ifPresent(utilisateurRepository::delete);

            mockMvc.perform(post("/api/auth/register")
                    .contentType("application/json")
                    .content(objectMapper.writeValueAsString(
                            registerBody(newUsername, newUsername + "@example.com", "unBonMotDePasse123"))))
                    .andExpect(status().isOk())
                    .andExpect(content().string(containsString("succès")));

            utilisateurRepository.findByUsername(newUsername).ifPresent(utilisateurRepository::delete);
        }

        @Test
        @DisplayName("devrait rejeter un nom d'utilisateur déjà pris")
        void register_echoue_si_username_existe_deja() throws Exception {
            mockMvc.perform(post("/api/auth/register")
                    .contentType("application/json")
                    .content(objectMapper.writeValueAsString(
                            registerBody(TEST_USERNAME, "autre@example.com", "unAutreMotDePasse123"))))
                    .andExpect(status().isConflict());
        }

        @Test
        @DisplayName("devrait rejeter un mot de passe trop court")
        void register_echoue_si_mot_de_passe_trop_court() throws Exception {
            mockMvc.perform(post("/api/auth/register")
                    .contentType("application/json")
                    .content(objectMapper.writeValueAsString(
                            registerBody("nouvel_user_court", "court@example.com", "court1"))))
                    .andExpect(status().isBadRequest());
        }
    }
}