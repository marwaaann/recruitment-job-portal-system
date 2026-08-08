package com.kiwisoft.jobportal.security;

import com.kiwisoft.jobportal.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;

import java.util.Date;

@Component

public class JwtUtil {

    @Value("${jwt.secret-key}")

    private String secret;


    @Value("${jwt.access-token-expiration}")

    private long accessExpiration;


    @Value("${jwt.refresh-token-expiration}")

    private long refreshExpiration;


    private SecretKey getKey(){

        return Keys.hmacShaKeyFor(secret.getBytes());

    }


    public String generateAccessToken(User user){

        return Jwts.builder()

                .subject(user.getEmail())

                .claim("userId", user.getId())

                .claim("role", user.getRole().name())

                .claim("fullName", user.getFullName())

                .issuedAt(new Date())

                .expiration(

                        new Date(

                                System.currentTimeMillis()

                                        + accessExpiration

                        )

                )

                .signWith(

                        getKey(),

                        Jwts.SIG.HS256

                )

                .compact();
    }

    public String generateRefreshToken(User user){

        return Jwts.builder()

                .subject(user.getEmail())

                .claim("userId", user.getId())

                .claim("role", user.getRole().name())

                .claim("fullName", user.getFullName())

                .issuedAt(new Date())

                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + refreshExpiration
                        )
                )

                .signWith(
                        getKey(),
                        Jwts.SIG.HS256
                )

                .compact();
    }

    private Claims extractAllClaims(String token){

        return Jwts.parser()

                .verifyWith(getKey())

                .build()

                .parseSignedClaims(token)

                .getPayload();
    }

    public String extractFullName(String token){

        Claims claims = extractAllClaims(token);

        return claims.get("fullName", String.class);
    }


    public String extractEmail(String token){
        Claims claims = extractAllClaims(token);

        return claims.getSubject();

    }

    public Long extractUserId(String token){

        Claims claims = extractAllClaims(token);

        return claims.get("userId", Long.class);
    }

    public String extractRole(String token){

        Claims claims = extractAllClaims(token);

        return claims.get("role", String.class);
    }



    public boolean validateToken(String token){

        try{

            Jwts.parser()

                    .verifyWith(getKey())

                    .build()

                    .parseSignedClaims(token);

            return true;

        }

        catch(Exception e){

            return false;

        }

    }


}