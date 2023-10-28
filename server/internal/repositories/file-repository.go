package repositories

import (
	repoutils "JulienR1/moneymanager2/server/internal/pkg/repo-utils"
	"errors"
)

type FileRepository struct {
	db *repoutils.Database
}

func MakeFileRepository(db *repoutils.Database) FileRepository {
	return FileRepository{db: db}
}

func (repository *FileRepository) SaveFile(url string) (int, error) {
	return 0, errors.New("not implemented")
}
