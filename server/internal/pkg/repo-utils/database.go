package repoutils

import (
	"database/sql"
	"sync"
)

type Connection interface {
	Query(query string, args ...any) (*sql.Rows, error)
	QueryRow(query string, args ...any) *sql.Row
}

type Database struct {
	mutex      sync.Mutex
	inner      *sql.DB
	Connection Connection
}

func MakeDatabase(db *sql.DB) Database {
	return Database{inner: db, Connection: db}
}

func (db *Database) WithTransaction(body func() (interface{}, error)) (interface{}, error) {
	db.mutex.Lock()
	defer db.mutex.Unlock()

	tx, err := db.inner.Begin()
	if err != nil {
		return nil, err
	}

	db.Connection = tx
	defer func() {
		tx.Rollback()
		db.Connection = db.inner
	}()

	data, err := body()
	if err != nil {
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return data, nil
}
