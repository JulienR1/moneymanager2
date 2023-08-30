package services

import (
	"errors"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt"
)

type TokenService struct{}

func MakeTokenService() TokenService {
	return TokenService{}
}

func (service *TokenService) GenerateAccessToken(userId int) (string, error) {
	now := time.Now()
	key, _ := service.getJwtKey(nil)

	claims := jwt.StandardClaims{
		IssuedAt:  now.Unix(),
		Subject:   strconv.Itoa(userId),
		ExpiresAt: now.Add(5 * time.Minute).Unix(),
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(key)
	if err != nil {
		return "", errors.New("could not generate an authentication key")
	}
	return token, nil
}

func (service *TokenService) GenerateRefreshToken() (string, error) {
	now := time.Now()
	key, _ := service.getJwtKey(nil)

	claims := jwt.StandardClaims{
		Subject:   "refresh",
		IssuedAt:  now.Unix(),
		ExpiresAt: now.Add(24 * 14 * time.Hour).Unix(),
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(key)
	if err != nil {
		return "", errors.New("could not generate a refresh key")
	}
	return token, nil
}

func (service *TokenService) ValidateToken(token string) (jwt.StandardClaims, error) {
	claims := jwt.StandardClaims{}
	parsedToken, err := jwt.ParseWithClaims(token, &claims, service.getJwtKey)

	if err != nil || !parsedToken.Valid || parsedToken.Claims.Valid() != nil {
		return claims, errors.New("invalid token")
	}
	return claims, nil
}

func (service *TokenService) getJwtKey(t *jwt.Token) (interface{}, error) {
	return []byte(os.Getenv("JWT_KEY")), nil
}
