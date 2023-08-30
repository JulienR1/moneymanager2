package services

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

type UserService struct{}

func MakeUserService() UserService {
	return UserService{}
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
