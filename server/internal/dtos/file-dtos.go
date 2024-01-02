package dtos

type FileDto struct {
	Id   int    `json:"id"`
	Url  string `json:"url"`
	Mime string `json:"mime"`
}
