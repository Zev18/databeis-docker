FROM golang:1.22

WORKDIR /app

RUN go install github.com/cosmtrek/air@latest

COPY . .
WORKDIR /app/backend

RUN go mod tidy

