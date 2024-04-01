package main

import (
	"api/cmd/auth"
	"api/cmd/database"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	database.ConnectDb()
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowMethods:     "GET,POST,PATCH,DELETE,PUT",
		AllowCredentials: true,
	}))

	micro := fiber.New()
	app.Mount("/api", micro)
	auth.GoogleConfig()

	app.Use(logger.New())
	setupRoutes(micro)

	if err := app.Listen(":8000"); err != nil {
		log.Fatal(err)
	}
}
