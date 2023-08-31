package services

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

const REFRESH_TOKEN = "refresh_token"

type CookieService struct{}

func MakeCookieService() CookieService {
	return CookieService{}
}

func (service *CookieService) MakeRefreshTokenCookie(token string) *fiber.Cookie {
	return &fiber.Cookie{
		Name:     REFRESH_TOKEN,
		Value:    token,
		Expires:  time.Now().Add(24 * 14 * time.Hour),
		HTTPOnly: true,
		Secure:   true,
	}
}

func (service *CookieService) MakeRefreshTokenClearingCookie() *fiber.Cookie {
	return &fiber.Cookie{
		Name:     REFRESH_TOKEN,
		Expires:  time.Now().Add(-(2 * time.Hour)),
		HTTPOnly: true,
		Secure:   true,
	}
}
