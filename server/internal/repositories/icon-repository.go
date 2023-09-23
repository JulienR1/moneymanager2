package repositories

import repoutils "JulienR1/moneymanager2/server/internal/pkg/repo-utils"

type IconRepository struct {
	db *repoutils.Database
}

type IconRecord struct {
	Id    int
	Label string
}

func MakeIconRepository(db *repoutils.Database) IconRepository {
	return IconRepository{db: db}
}

func (repo *IconRepository) FindByName(name string) (*IconRecord, error) {
	query := "SELECT id, label FROM icons WHERE label = $1"

	var record IconRecord
	if err := repo.db.Connection.QueryRow(query, name).Scan(&record.Id, &record.Label); err != nil {
		return nil, err
	}

	return &record, nil
}
