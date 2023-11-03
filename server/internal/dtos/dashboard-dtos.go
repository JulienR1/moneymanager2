package dtos

import "time"

type DashboardDto struct {
	Id           int           `json:"id"`
	Key          string        `json:"key"`
	Label        string        `json:"label"`
	CreationDate time.Time     `json:"creationDate"`
	Categories   []CategoryDto `json:"categories"`
}

type TeammateDto struct {
	Id         int     `json:"id"`
	Firstname  string  `json:"firstname"`
	Lastname   string  `json:"lastname"`
	PictureUrl *string `json:"pictureUrl"`
}
