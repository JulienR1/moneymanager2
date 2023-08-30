package repositories

type UserRecord struct {
	Id        int
	Firstname string
	Lastname  string
	Username  string
	Password  []byte
}

type UserRepository struct{}

// TODO
func (repo *UserRepository) FindUserById(id int) UserRecord {
	return UserRecord{
		Id:        0,
		Firstname: "John",
		Lastname:  "Doe",
		Username:  "john.doe@mail.com",
		Password:  []byte("hashed password from db"),
	}
}

// TODO
func (repo *UserRepository) FindUserByEmail(email string) UserRecord {
	return repo.FindUserById(0)
}
