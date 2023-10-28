package datauri

import (
	"encoding/base64"
	"errors"
	"strings"
)

type DataURI struct {
	MimeType string
	Data     []byte
}

func New(datauri string) (*DataURI, error) {
	prefix := datauri[:5]
	if prefix != "data:" {
		return nil, errors.New("invalid prefix")
	}

	splits := strings.Split(datauri[5:], ",")
	mimeType := strings.Replace(splits[0], ";base64", "", 1)

	data, err := base64.StdEncoding.DecodeString(splits[1])
	if err != nil {
		return nil, errors.New("invalid encoded data")
	}

	return &DataURI{MimeType: mimeType, Data: data}, nil
}
