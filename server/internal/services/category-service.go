package services

import (
	"JulienR1/moneymanager2/server/internal/dtos"
	"JulienR1/moneymanager2/server/internal/repositories"
	"fmt"
)

type CategoryService struct {
	repository     *repositories.CategoryRepository
	iconRepository *repositories.IconRepository
}

func MakeCategoryService(r *repositories.CategoryRepository, iconRepository *repositories.IconRepository) CategoryService {
	return CategoryService{repository: r, iconRepository: iconRepository}
}

func (service *CategoryService) GetAssociatedWithDashboardById(dashboardId, categoryId int) (*dtos.CategoryDto, error) {
	categories, err := service.GetAllAssociatedWithDashboard(dashboardId)
	if err != nil {
		return nil, err
	}

	for _, category := range categories {
		if category.Id == categoryId {
			return &category, nil
		}
	}

	return nil, fmt.Errorf("could not find a category (id=%d) associated with the specified dashboard (id=%d)", categoryId, dashboardId)
}

func (service *CategoryService) GetAllAssociatedWithDashboard(dashboardId int) ([]dtos.CategoryDto, error) {
	categories, err := service.repository.FindFromDashboardId(dashboardId)
	if err != nil {
		return []dtos.CategoryDto{}, fmt.Errorf("could not find categories associated with this dashboard (%d)", dashboardId)
	}

	result := make([]dtos.CategoryDto, len(categories))
	for index, category := range categories {
		result[index] = dtos.CategoryDto{
			Id:    category.Id,
			Label: category.Label,
			Color: category.Color,
			Icon:  category.Icon,
		}
	}

	return result, nil
}

func (service *CategoryService) AddCategory(dashboardId int, label, color, iconName string) (*dtos.NewCategoryDto, error) {
	icon, err := service.iconRepository.FindByName(iconName)
	if err != nil {
		return nil, fmt.Errorf("could not find the requested icon (%s)", iconName)
	}

	categoryId, err := service.repository.CreateCategory(label, color, icon.Id, dashboardId)
	if err != nil {
		return nil, fmt.Errorf("could not create the category for the specified dashboard (%d)", dashboardId)
	}

	return &dtos.NewCategoryDto{Id: categoryId}, nil
}
