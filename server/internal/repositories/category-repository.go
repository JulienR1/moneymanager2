package repositories

import (
	repoutils "JulienR1/moneymanager2/server/internal/pkg/repo-utils"
)

type CategoryRepository struct {
	db *repoutils.Database
}

type CategoryRecord struct {
	Id    int
	Label string
	Color string
	Icon  string
}

func MakeCategoryRepository(db *repoutils.Database) CategoryRepository {
	return CategoryRepository{db: db}
}

func (repo *CategoryRepository) FindFromDashboardId(dashboardId int) ([]CategoryRecord, error) {
	query := "SELECT id, label, color, icon_label FROM categories_from_dashboards WHERE dashboard_id = $1"
	rows, err := repo.db.Connection.Query(query, dashboardId)
	if err != nil {
		return []CategoryRecord{}, err
	}

	defer rows.Close()
	result := []CategoryRecord{}

	for rows.Next() {
		var category CategoryRecord
		rows.Scan(&category.Id, &category.Label, &category.Color, &category.Icon)
		result = append(result, category)
	}

	return result, nil
}

func (repo *CategoryRepository) CreateCategory(label, color string, iconId, dashboardId int) (int, error) {
	categoryId, err := repo.db.WithTransaction(func() (interface{}, error) {
		var categoryId int
		query := "INSERT INTO categories (label, color, icon_id) VALUES ($1, $2, $3) RETURNING id"
		if err := repo.db.Connection.QueryRow(query, label, color, iconId).Scan(&categoryId); err != nil {
			return 0, err
		}

		query = "INSERT INTO dashboard_categories (category_id, dashboard_id) VALUES ($1, $2)"
		if _, err := repo.db.Connection.Exec(query, categoryId, dashboardId); err != nil {
			return 0, err
		}

		return categoryId, nil
	})

	if err != nil {
		return 0, err
	}

	return categoryId.(int), nil
}
