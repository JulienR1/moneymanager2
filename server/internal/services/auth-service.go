package services

import (
	"JulienR1/moneymanager2/server/internal/repositories"
	"errors"
	"strconv"

	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	tokenService   *TokenService
	userRepository *repositories.UserRepository
}

func MakeAuthService(t *TokenService, u *repositories.UserRepository) AuthService {
	return AuthService{tokenService: t, userRepository: u}
}

func (service *AuthService) Login(username, password string) (string, error) {
	user := service.userRepository.FindUserByEmail(username)
	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(password)); err != nil {
		return "", errors.New("invalid password")
	}

	return service.tokenService.GenerateAccessToken(user.Id)
}

func (service *AuthService) Authenticate(jwtToken string) (int, error) {
	claims, err := service.tokenService.ValidateToken(jwtToken)
	if err != nil {
		return 0, err
	}

	return strconv.Atoi(claims.Subject)
}
