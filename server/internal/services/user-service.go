package services

import (
	"JulienR1/moneymanager2/server/internal/dtos"
	"JulienR1/moneymanager2/server/internal/repositories"
	"errors"

	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	userRepository *repositories.UserRepository
}

func MakeUserService(userRepository *repositories.UserRepository) UserService {
	return UserService{userRepository: userRepository}
}

func (service *UserService) RegisterUser(firstname, lastname, username, password string) (*dtos.NewUserDto, error) {
	existingUser, _ := service.userRepository.FindUserByEmail(username)

	if existingUser != nil {
		return nil, errors.New("An account is already registered with this email.")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	userId, err := service.userRepository.CreateUser(firstname, lastname, username, string(hashedPassword))
	if err != nil {
		return nil, err
	}

	return &dtos.NewUserDto{Id: userId}, nil
}

func (service *UserService) FindUserById(id int) (*dtos.UserDto, error) {
	record, err := service.userRepository.FindUserById(id)
	if err != nil {
		return nil, err
	}

	dto := dtos.UserDto{
		Id:         record.Id,
		Firstname:  record.Firstname,
		Lastname:   record.Lastname,
		Username:   record.Username,
		PictureUrl: nil,
	}

	if record.PictureUrl.Valid {
		dto.PictureUrl = &record.PictureUrl.String
	}

	return &dto, nil
}
