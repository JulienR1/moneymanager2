package jsonutils

type Error struct {
	E string `json:"error"`
}

func NewError(err error) Error {
	return Error{E: err.Error()}
}
