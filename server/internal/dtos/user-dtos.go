package dtos

type UserDto struct {
	Id         int     `json:"id"`
	Firstname  string  `json:"firstname"`
	Lastname   string  `json:"lastname"`
	Username   string  `json:"username"`
	PictureUrl *string `json:"pictureUrl"`
}

type NewUserDto struct {
	Id int `json:"id"`
}
