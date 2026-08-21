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