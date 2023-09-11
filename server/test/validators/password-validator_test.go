package validators_test

import (
	"JulienR1/moneymanager2/server/internal/validators"
	"testing"

	"github.com/go-playground/validator/v10"
)

type Password struct {
	Value string `validate:"password"`
}

var v *validator.Validate

func setupTest() {
	v = validator.New()
	v.RegisterValidation("password", validators.ValidatePassword)
}

func TestValidPassword(t *testing.T) {
	setupTest()

	var password = Password{Value: "Aab1234!"}
	err := v.Struct(password)

	if err != nil {
		t.Fatalf("expected %s to be valid, got invalid.", password.Value)
	}
}

func TestInvalidPassword(t *testing.T) {
	setupTest()

	var invalidPasswords = []string{"Aaaaaaa!", "Aaaaaaa1", "aaaaaa!1", "AAAAAA!1", "Aa1!"}
	for _, password := range invalidPasswords {
		var record = Password{Value: password}
		err := v.Struct(record)

		if err == nil {
			t.Fatalf("expected %s to be invalid, no error was thrown", record.Value)
		}
	}
}
