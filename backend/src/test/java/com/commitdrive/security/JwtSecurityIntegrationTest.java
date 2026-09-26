package com.commitdrive.security;

import com.commitdrive.dto.AuthDtos.LoginRequest;
import com.commitdrive.dto.AuthDtos.RegisterRequest;
import com.commitdrive.entity.User;
import com.commitdrive.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class JwtSecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Value("${commitdrive.jwt.secret}")
    private String jwtSecret;

    private String validToken;
    private User testUser;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        RegisterRequest register = new RegisterRequest(
                "jwt.test@commitdrive.dev",
                "Password123!",
                "Security Test User",
                "2026",
                "SDE Aspirant 2026"
        );

        testUser = userRepository.save(User.builder()
                .email(register.getEmail())
                .passwordHash("$2a$10$abcdefghijklmnopqrstuvwxyz012345678901234567890123456789")
                .fullName(register.getFullName())
                .role(register.getRole())
                .targetYear(register.getTargetYear())
                .streak(1)
                .build());

        validToken = jwtService.generateToken(testUser);
    }

    @Test
    @DisplayName("a) Requests without token to protected endpoints must fail with 401")
    void requestsWithoutTokenToProtectedEndpointsFailWith401() throws Exception {
        mockMvc.perform(get("/api/learning/topics"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"));

        mockMvc.perform(get("/api/practical/missions"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));

        mockMvc.perform(get("/api/dashboard/stats"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    @DisplayName("Spoofed X-User-Id header alone must NOT bypass security and must fail with 401")
    void spoofedHeaderAloneFailsWith401() throws Exception {
        mockMvc.perform(get("/api/learning/topics")
                        .header("X-User-Id", UUID.randomUUID().toString()))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    @DisplayName("Public endpoints (register, login, health) remain unprotected")
    void publicEndpointsAccessibleWithoutToken() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk());

        RegisterRequest regReq = new RegisterRequest(
                "newstudent@commitdrive.dev",
                "StudentPass123",
                "New Student",
                "2026",
                "SDE Aspirant 2026"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regReq)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("b) Login/Register returns a valid signed JWT token containing user info")
    void loginReturnsValidToken() throws Exception {
        RegisterRequest regReq = new RegisterRequest(
                "tokenuser@commitdrive.dev",
                "MyPassword123!",
                "Token User",
                "2026",
                "SDE Aspirant 2026"
        );

        MvcResult regResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andReturn();

        JsonNode regNode = objectMapper.readTree(regResult.getResponse().getContentAsString());
        String tokenFromRegister = regNode.get("token").asText();
        assertNotNull(tokenFromRegister);
        assertTrue(jwtService.validateToken(tokenFromRegister));

        LoginRequest loginReq = new LoginRequest("tokenuser@commitdrive.dev", "MyPassword123!");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andReturn();

        JsonNode loginNode = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String tokenFromLogin = loginNode.get("token").asText();
        assertNotNull(tokenFromLogin);
        assertTrue(jwtService.validateToken(tokenFromLogin));

        UUID extractedId = jwtService.extractUserId(tokenFromLogin);
        assertNotNull(extractedId);
    }

    @Test
    @DisplayName("c) Using valid JWT token successfully accesses protected endpoints")
    void validTokenAccessesProtectedEndpoints() throws Exception {
        mockMvc.perform(get("/api/learning/topics")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/practical/missions")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/dashboard/stats")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("d) Expired or tampered tokens are rejected with 401")
    void expiredOrTamperedTokensRejectedWith401() throws Exception {
        // Tampered token (modify last signature character)
        String tamperedToken = validToken.substring(0, validToken.length() - 3) + "xyz";
        mockMvc.perform(get("/api/learning/topics")
                        .header("Authorization", "Bearer " + tamperedToken))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));

        // Expired token (issued 2 hours ago, expired 1 hour ago)
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        Date issuedAt = new Date(System.currentTimeMillis() - 7200000);
        Date expiredAt = new Date(System.currentTimeMillis() - 3600000);
        String expiredToken = Jwts.builder()
                .subject(testUser.getId().toString())
                .claim("userId", testUser.getId().toString())
                .claim("email", testUser.getEmail())
                .issuedAt(issuedAt)
                .expiration(expiredAt)
                .signWith(key)
                .compact();

        mockMvc.perform(get("/api/learning/topics")
                        .header("Authorization", "Bearer " + expiredToken))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }
}
