package services

import (
	"JulienR1/moneymanager2/server/internal/dtos"
	repoutils "JulienR1/moneymanager2/server/internal/pkg/repo-utils"
	"JulienR1/moneymanager2/server/internal/repositories"
	"errors"

	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	userRepository      *repositories.UserRepository
	dashboardRepository *repositories.DashboardRepository
	db                  *repoutils.Database
}

func MakeUserService(userRepository *repositories.UserRepository, dashboardRepository *repositories.DashboardRepository, db *repoutils.Database) UserService {
	return UserService{db: db, userRepository: userRepository, dashboardRepository: dashboardRepository}
}

func (service *UserService) RegisterUser(firstname, lastname, username, password string) (*dtos.NewUserDto, error) {
	existingUser, _ := service.userRepository.FindUserByEmail(username)

	if existingUser != nil {
		return nil, errors.New("an account is already registered with this email")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	userId, err := service.db.WithTransaction(func() (interface{}, error) {
		userId, err := service.userRepository.CreateUser(firstname, lastname, username, string(hashedPassword))
		if err != nil {
			return nil, errors.New("account creation failed")
		}

		dashboardId, err := service.dashboardRepository.AddDashboard("personal", userId)
		if err != nil {
			return nil, errors.New("could not generate a personal dashboard")
		}

		if err := service.dashboardRepository.AssignDashboardToUser(dashboardId, userId); err != nil {
			return nil, errors.New("could not associate the user with the personal dashboard")
		}

		return userId, nil
	})

	if err != nil {
		return nil, err
	}

	return &dtos.NewUserDto{Id: userId.(int)}, nil
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
