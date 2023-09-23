package repositories

import (
	repoutils "JulienR1/moneymanager2/server/internal/pkg/repo-utils"
	"database/sql"
)

type UserRecord struct {
	Id         int
	Firstname  string
	Lastname   string
	Username   string
	Password   []byte
	PictureUrl sql.NullString
}

type UserRepository struct {
	db *repoutils.Database
}

func MakeUserRepository(db *repoutils.Database) UserRepository {
	return UserRepository{db: db}
}

func (repo *UserRepository) CreateUser(firstname, lastname, email, hashedPassword string) (int, error) {
	var userId int
	row := repo.db.Connection.QueryRow("INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id", firstname, lastname, email, hashedPassword)
	if err := row.Scan(&userId); err != nil {
		return 0, err
	}

	return userId, nil
}

func (repo *UserRepository) FindUserById(id int) (*UserRecord, error) {
	query := repo.db.Connection.QueryRow(`SELECT * FROM profiles WHERE id=$1`, id)
	return findUser(query)
}

func (repo *UserRepository) FindUserByEmail(email string) (*UserRecord, error) {
	query := repo.db.Connection.QueryRow(`SELECT * FROM profiles WHERE email=$1`, email)
	return findUser(query)
}

func findUser(row *sql.Row) (*UserRecord, error) {
	var user UserRecord
	err := row.Scan(&user.Id, &user.Username, &user.Firstname, &user.Lastname, &user.Password, &user.PictureUrl)

	if err != nil {
		return nil, err
	}
	return &user, nil
}
