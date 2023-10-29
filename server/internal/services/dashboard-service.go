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
}

func MakeDashboardService(r *repositories.DashboardRepository, categoryService *CategoryService) DashboardService {
	return DashboardService{repository: r, categoryService: categoryService}
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
	if dashboards, err := service.GetAllByUserId(userId); err == nil {
		for _, dashboard := range dashboards {
			if dashboard.Id == dashboardId {
				return true
			}
		}
	}
	return false
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
