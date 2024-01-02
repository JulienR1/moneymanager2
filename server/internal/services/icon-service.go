package services

import (
	"JulienR1/moneymanager2/server/internal/repositories"
	"errors"
)

type IconService struct {
	repository *repositories.IconRepository
}

func MakeIconService(r *repositories.IconRepository) IconService {
	return IconService{repository: r}
}

func (service *IconService) GetIcons() ([]string, error) {
	icons, err := service.repository.FindAvailableIcons()
	if err != nil {
		return []string{}, errors.New("could not find icons")
	}
	return icons, nil
}
