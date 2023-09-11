package validators

import (
	"regexp"
	"strings"

	"github.com/go-playground/validator/v10"
)

func ValidatePassword(f validator.FieldLevel) bool {
	var value = f.Field().String()

	var hasLower = strings.ToUpper(value) != value
	var hasUpper = strings.ToLower(value) != value
	var hasNumber, _ = regexp.Match(`[0-9]+`, []byte(value))
	var hasSpecialCharacter, _ = regexp.Match(`[!@#$%^&*()]+`, []byte(value))
	var isLongEnough = len(value) >= 8

	return hasLower && hasUpper && hasNumber && hasSpecialCharacter && isLongEnough
}
