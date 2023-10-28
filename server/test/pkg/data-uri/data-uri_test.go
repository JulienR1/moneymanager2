package datauri_test

import (
	datauri "JulienR1/moneymanager2/server/internal/pkg/data-uri"
	"testing"
)

func TestDataURI(t *testing.T) {
	tests := []struct {
		input    string
		expected datauri.DataURI
	}{
		{
			input:    "data:image/png;base64,cmFuZG9tIGRhdGE=",
			expected: datauri.DataURI{MimeType: "image/png", Data: []byte("random data")},
		},
		{
			input:    "data:image/png,cmFuZG9tIGRhdGE=",
			expected: datauri.DataURI{MimeType: "image/png", Data: []byte("random data")},
		},
		{
			input:    "data:application/pdf,b3RoZXIgZGF0YQ==",
			expected: datauri.DataURI{MimeType: "application/pdf", Data: []byte("other data")},
		},
	}

	for _, test := range tests {
		result, err := datauri.New(test.input)
		if err != nil {
			t.Fatalf("expected datauri, got error=%s", err)
		}

		if result.MimeType != test.expected.MimeType {
			t.Fatalf("expected mime type=%s, got=%s", test.expected.MimeType, result.MimeType)
		}

		if string(result.Data) != string(test.expected.Data) {
			t.Fatalf("expected data=%s, got=%s", test.expected.Data, result.Data)
		}
	}
}

func TestInvalidDataURI(t *testing.T) {
	test := "application/pdf;base64,data_here"
	_, err := datauri.New(test)

	if err == nil {
		t.Fatal("expected error, got datauri")
	}
}
