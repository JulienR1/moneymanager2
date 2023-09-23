package dtos

type CategoryDto struct {
	Id    int    `json:"id"`
	Label string `json:"label"`
	Color string `json:"color"`
	Icon  string `json:"icon"`
}

type NewCategoryDto struct {
	Id int `json:"id"`
}
