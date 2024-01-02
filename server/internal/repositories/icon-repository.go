package repositories

import (
	repoutils "JulienR1/moneymanager2/server/internal/pkg/repo-utils"
)

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

func (repository *IconRepository) FindByName(name string) (*IconRecord, error) {
	query := "SELECT id, label FROM icons WHERE label = $1"

	var record IconRecord
	if err := repository.db.Connection.QueryRow(query, name).Scan(&record.Id, &record.Label); err != nil {
		return nil, err
	}

	return &record, nil
}

func (repository *IconRepository) FindAvailableIcons() ([]string, error) {
	query := "SELECT label FROM icons"

	rows, err := repository.db.Connection.Query(query)
	if err != nil {
		return []string{}, err
	}

	icons := []string{}
	for rows.Next() {
		var icon string
		rows.Scan(&icon)
		icons = append(icons, icon)
	}

	return icons, nil
}
