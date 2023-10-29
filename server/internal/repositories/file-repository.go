package repositories

import (
	repoutils "JulienR1/moneymanager2/server/internal/pkg/repo-utils"
)

type FileRepository struct {
	db *repoutils.Database
}

func MakeFileRepository(db *repoutils.Database) FileRepository {
	return FileRepository{db: db}
}

func (repository *FileRepository) SaveFile(url string) (int, error) {
	var fileId int

	query := "INSERT INTO remote_files (url) VALUES ($1) RETURNING id"
	if err := repository.db.Connection.QueryRow(query, url).Scan(&fileId); err != nil {
		return 0, err
	}

	return fileId, nil
}
