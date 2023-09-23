package repositories

import (
	repoutils "JulienR1/moneymanager2/server/internal/pkg/repo-utils"
	"time"
)

type DashboardRecord struct {
	Id           int
	Label        string
	CreationDate time.Time
	CreatorId    int
}

type DashboardRepository struct {
	db *repoutils.Database
}

func MakeDashboardRepository(db *repoutils.Database) DashboardRepository {
	return DashboardRepository{db: db}
}

func (repo *DashboardRepository) FindAllDashboardsByUserId(userId int) ([]DashboardRecord, error) {
	query := "SELECT id, label, creation_date, creator_id FROM associated_dashboards WHERE user_id = $1"
	rows, err := repo.db.Connection.Query(query, userId)
	if err != nil {
		return []DashboardRecord{}, err
	}

	defer rows.Close()
	var result []DashboardRecord

	for rows.Next() {
		var record DashboardRecord
		rows.Scan(&record.Id, &record.Label, &record.CreationDate, &record.CreatorId)
		result = append(result, record)
	}

	return result, nil
}

func (repo *DashboardRepository) FindById(dashboardId int) (*DashboardRecord, error) {
	query := "SELECT id, label, creation_date, creator_id FROM dashboards WHERE id = $1"
	row := repo.db.Connection.QueryRow(query, dashboardId)

	var dashboard DashboardRecord
	if err := row.Scan(&dashboard.Id, &dashboard.Label, &dashboard.CreationDate, &dashboard.CreatorId); err != nil {
		return nil, err
	}

	return &dashboard, nil
}

func (repo *DashboardRepository) AddDashboard(label string, creatorId int) (int, error) {
	var dashboardId int
	row := repo.db.Connection.QueryRow("INSERT INTO dashboards (label, creator_id) VALUES ('personal', $1) RETURNING id", creatorId)

	if err := row.Scan(&dashboardId); err != nil {
		return 0, err
	}

	return dashboardId, nil
}

func (repo *DashboardRepository) AssignDashboardToUser(dashboardId, userId int) error {
	_, err := repo.db.Connection.Query("INSERT INTO user_to_dashboard (user_id, dashboard_id) VALUES ($1, $2)", userId, dashboardId)
	return err
}
