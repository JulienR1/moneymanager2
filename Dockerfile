#### Server
FROM golang:1.21 as server

WORKDIR /server

COPY server/go.mod server/go.sum ./
RUN go mod download

COPY server/ .

RUN CGO_ENABLED=0 GOOS=linux go build -o /main cmd/server/main.go

#### Web
FROM node:18 as web

WORKDIR /web
RUN mkdir /dist

COPY web/package*.json ./
RUN npm ci 

COPY web/ ./
RUN npm run build -- --out-dir /dist

#### App
FROM scratch
WORKDIR /
COPY --from=server /main /
COPY --from=web /dist /public

ENV PORT=8080
EXPOSE $PORT 

ENTRYPOINT ["/main"]