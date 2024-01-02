package repositories

import (
	repoutils "JulienR1/moneymanager2/server/internal/pkg/repo-utils"
)

type FileRepository struct {
	db *repoutils.Database
}

type FileRecord struct {
	Id   int
	Url  string
	Mime string
}

func MakeFileRepository(db *repoutils.Database) FileRepository {
	return FileRepository{db: db}
}

func (repository *FileRepository) SaveFile(url, mime string) (int, error) {
	var fileId int

	query := "INSERT INTO remote_files (url, mime) VALUES ($1, $2) RETURNING id"
	if err := repository.db.Connection.QueryRow(query, url, mime).Scan(&fileId); err != nil {
		return 0, err
	}

	return fileId, nil
}

func (repository *FileRepository) FindFileById(fileId int) (*FileRecord, error) {
	var record FileRecord

	query := "SELECT id, url, mime FROM remote_files WHERE id = $1"
	if err := repository.db.Connection.QueryRow(query, fileId).Scan(&record.Id, &record.Url, &record.Mime); err != nil {
		return nil, err
	}

	return &record, nil
}
