package com.kiwisoft.jobportal.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {

    // Create Access Token Cookie
    public void createAccessTokenCookie(
            HttpServletResponse response,
            String accessToken
    ) {

        Cookie cookie = new Cookie("accessToken", accessToken);

        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true in production (HTTPS)
        cookie.setPath("/");
        cookie.setMaxAge(15 * 60); // 15 minutes

        response.addCookie(cookie);
    }

    // Create Refresh Token Cookie
    public void createRefreshTokenCookie(
            HttpServletResponse response,
            String refreshToken
    ) {

        Cookie cookie = new Cookie("refreshToken", refreshToken);

        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true in production (HTTPS)
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days

        response.addCookie(cookie);
    }

    // Clear Access Token Cookie
    public void clearAccessTokenCookie(
            HttpServletResponse response
    ) {

        Cookie cookie = new Cookie("accessToken", "");

        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        response.addCookie(cookie);
    }

    // Clear Refresh Token Cookie
    public void clearRefreshTokenCookie(
            HttpServletResponse response
    ) {

        Cookie cookie = new Cookie("refreshToken", "");

        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        response.addCookie(cookie);
    }
}