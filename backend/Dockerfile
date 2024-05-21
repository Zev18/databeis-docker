FROM golang:1.22

ARG ENV=dev

WORKDIR /app

# Conditional installation of air based on the environment
RUN if [ "$ENV" = "dev" ]; then go install github.com/cosmtrek/air@latest; fi

COPY . .
WORKDIR /app/backend

RUN go mod tidy

