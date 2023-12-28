package services

import (
	"JulienR1/moneymanager2/server/internal/dtos"
	datauri "JulienR1/moneymanager2/server/internal/pkg/data-uri"
	"JulienR1/moneymanager2/server/internal/repositories"
	"bytes"
	"errors"
	"fmt"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/google/uuid"
)

type FileService struct {
	repository *repositories.FileRepository
}

func MakeFileService(repository *repositories.FileRepository) FileService {
	return FileService{repository: repository}
}

func (service *FileService) StoreFile(uri *datauri.DataURI) (int, error) {
	session := session.Must(session.NewSession())
	uploader := s3manager.NewUploader(session)

	fileKey, err := uuid.NewRandom()
	if err != nil {
		return 0, errors.New("could not generate a key for the file")
	}

	key := aws.String(fileKey.String())
	bucket := aws.String(os.Getenv("BUCKETNAME"))

	result, err := uploader.Upload(&s3manager.UploadInput{
		Key:         key,
		Bucket:      bucket,
		Body:        bytes.NewReader(uri.Data),
		ContentType: aws.String(uri.MimeType),
	})
	if err != nil {
		return 0, errors.New("could not upload file")
	}

	id, err := service.repository.SaveFile(result.Location, uri.MimeType)
	if err != nil {
		svc := s3.New(session)
		svc.DeleteObject(&s3.DeleteObjectInput{Bucket: bucket, Key: key})
		return 0, errors.New("could not store the file")
	}

	return id, nil
}

func (service *FileService) FetchFile(fileId int) (*dtos.FileDto, error) {
	file, err := service.repository.FindFileById(fileId)
	if err != nil {
		return nil, fmt.Errorf("could not find file (id = %d)", fileId)
	}

	return &dtos.FileDto{
		Id:   file.Id,
		Url:  file.Url,
		Mime: file.Mime,
	}, nil
}
