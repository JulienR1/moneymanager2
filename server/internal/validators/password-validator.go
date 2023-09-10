package validators

import (
	"strings"
	"unicode"

	"github.com/go-playground/validator/v10"
)

var SPECIAL_CHARACTERS = []rune{'!', '@', '#', '$', '%', '^', '&', '*', '(', ')'}

func ValidatePassword(f validator.FieldLevel) bool {
	var value = f.Field().String()

	var hasLower = strings.ToUpper(value) != value
	var hasUpper = strings.ToLower(value) != value

	var hasNumber, hasSpecialCharacter bool
	for _, char := range value {
		if !hasNumber && unicode.IsNumber(char) {
			hasNumber = true
		}
		if !hasSpecialCharacter {
			for _, specialChar := range SPECIAL_CHARACTERS {
				if specialChar == char {
					hasSpecialCharacter = true
				}
			}
		}
	}

	return hasLower && hasUpper && hasNumber && hasSpecialCharacter
}
