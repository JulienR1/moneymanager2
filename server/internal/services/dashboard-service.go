package services

import (
	"JulienR1/moneymanager2/server/internal/dtos"
	"JulienR1/moneymanager2/server/internal/repositories"
	"fmt"

	"errors"
	"regexp"
	"strings"
)

type DashboardService struct {
	repository      *repositories.DashboardRepository
	categoryService *CategoryService
	userService     *UserService
}

func MakeDashboardService(r *repositories.DashboardRepository, categoryService *CategoryService, userService *UserService) DashboardService {
	return DashboardService{repository: r, categoryService: categoryService, userService: userService}
}

func (service *DashboardService) GetAllByUserId(userId int) ([]dtos.DashboardDto, error) {
	dashboards, err := service.repository.FindAllDashboardsByUserId(userId)
	if err != nil {
		return nil, errors.New("could not find associated dashboards")
	}

	result := make([]dtos.DashboardDto, len(dashboards))
	for index, dashboard := range dashboards {
		result[index] = *service.parseDashboard(&dashboard)
	}

	return result, nil
}

func (service *DashboardService) GetById(dashboardId int) (*dtos.DashboardDto, error) {
	record, err := service.repository.FindById(dashboardId)
	if err != nil {
		return nil, fmt.Errorf("could not find the requested dashboard (id = %d)", dashboardId)
	}
	return service.parseDashboard(record), nil
}

func (service *DashboardService) IsDashboardAssociatedWithUser(dashboardId, userId int) bool {
	if associatedUserIds, err := service.repository.FindAssociatedUsers(dashboardId); err == nil {
		for _, associatedUserId := range associatedUserIds {
			if associatedUserId == userId {
				return true
			}
		}
	}
	return false
}

func (service *DashboardService) GetAssociatedUsers(dashboardId int) ([]dtos.TeammateDto, error) {
	userIds, err := service.repository.FindAssociatedUsers(dashboardId)
	if err != nil {
		return nil, fmt.Errorf("could not find associated users for dashboard (id = %d)", dashboardId)
	}

	result := make([]dtos.TeammateDto, len(userIds))
	for index, userId := range userIds {
		user, err := service.userService.FindUserById(userId)
		if err != nil {
			return nil, err
		}

		result[index] = dtos.TeammateDto{
			Id:         userId,
			Firstname:  user.Firstname,
			Lastname:   user.Lastname,
			PictureUrl: user.PictureUrl,
		}
	}

	return result, nil
}

func (service *DashboardService) parseDashboard(dashboard *repositories.DashboardRecord) *dtos.DashboardDto {
	whiteSpaceRegex, _ := regexp.Compile(`\s+`)

	key := strings.ToLower(dashboard.Label)
	key = strings.TrimSpace(key)
	key = whiteSpaceRegex.ReplaceAllString(key, "-")

	categories, _ := service.categoryService.GetAllAssociatedWithDashboard(dashboard.Id)

	return &dtos.DashboardDto{
		Id:           dashboard.Id,
		Key:          key,
		Label:        dashboard.Label,
		CreationDate: dashboard.CreationDate,
		Categories:   categories,
	}
}
