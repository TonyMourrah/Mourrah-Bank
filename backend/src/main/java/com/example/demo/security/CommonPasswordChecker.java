package com.example.demo.security;

import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class CommonPasswordChecker {

    private static final Set<String> COMMON_PASSWORDS = Set.of(
        "password123", "123456789", "qwerty123", "password1234",
        "letmein123", "welcome123", "admin12345", "password1!",
        "motdepasse123", "azerty123456"
    );

    public boolean isCommon(String password) {
        return COMMON_PASSWORDS.contains(password.toLowerCase());
    }
}