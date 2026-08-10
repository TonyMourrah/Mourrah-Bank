package com.example.demo.security;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCKOUT_DURATION_MINUTES = 15;

    private final ConcurrentHashMap<String, AtomicInteger> attempts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Instant> lockoutUntil = new ConcurrentHashMap<>();

    public void loginFailed(String username) {
        attempts.computeIfAbsent(username, k -> new AtomicInteger(0));
        int count = attempts.get(username).incrementAndGet();

        if (count >= MAX_ATTEMPTS) {
            lockoutUntil.put(username, Instant.now().plusSeconds(LOCKOUT_DURATION_MINUTES * 60));
        }
    }

    public void loginSucceeded(String username) {
        attempts.remove(username);
        lockoutUntil.remove(username);
    }

    public boolean isLocked(String username) {
        Instant until = lockoutUntil.get(username);
        if (until == null) return false;

        if (Instant.now().isAfter(until)) {
            lockoutUntil.remove(username);
            attempts.remove(username);
            return false;
        }
        return true;
    }

    public long getRemainingLockoutMinutes(String username) {
        Instant until = lockoutUntil.get(username);
        if (until == null) return 0;
        long seconds = Instant.now().until(until, java.time.temporal.ChronoUnit.SECONDS);
        return Math.max(0, (seconds + 59) / 60);
    }

    public int getAttemptsRemaining(String username) {
        AtomicInteger count = attempts.get(username);
        int used = count == null ? 0 : count.get();
        return Math.max(0, MAX_ATTEMPTS - used);
    }
}