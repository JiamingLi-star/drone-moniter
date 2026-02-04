package dao

import (
	"database/sql"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type MySQLDao struct {
	DB *sql.DB
}

func NewMySQLDao(dataSource string) (*MySQLDao, error) {
	db, err := sql.Open("mysql", dataSource)
	if err != nil {
		return nil, err
	}
	db.SetConnMaxLifetime(30 * time.Minute)
	db.SetMaxOpenConns(20)
	db.SetMaxIdleConns(10)

	if err := db.Ping(); err != nil {
		return nil, err
	}
	return &MySQLDao{DB: db}, nil
}
