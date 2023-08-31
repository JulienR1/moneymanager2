package services

import (
	"JulienR1/moneymanager2/server/internal/dtos"
	"JulienR1/moneymanager2/server/internal/repositories"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	userRepository *repositories.UserRepository
}

func MakeUserService(userRepository *repositories.UserRepository) UserService {
	return UserService{userRepository: userRepository}
}

// TODO
func (service *UserService) RegisterUser(firstname, lastname, username, password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	fmt.Println(hashedPassword)
	return nil
}

func (service *UserService) FindUserById(id int) dtos.UserDto {
	record := service.userRepository.FindUserById(id)
	return dtos.UserDto{
		Id:        record.Id,
		Firstname: record.Firstname,
		Lastname:  record.Lastname,
		Username:  record.Username,
	}
}
