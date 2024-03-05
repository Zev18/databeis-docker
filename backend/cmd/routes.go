package main

import (
	"api/cmd/handlers"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/markbates/goth"
	"github.com/markbates/goth/providers/google"
)

func setupRoutes(app *fiber.App) {

	goth.UseProviders(
		google.New(os.Getenv("OAUTH_KEY"), os.Getenv("OAUTH_SECRET"), "http://localhost:8000/api/auth/callback/google"),
	)

	app.Route("/sfarim", func(router fiber.Router) {
		router.Get("", handlers.ListSfarim)
		router.Post("/", handlers.CreateSefer)
		app.Post("/upload", handlers.GenerateFromCsv)
	})

	app.Route("/sfarim/:id", func(router fiber.Router) {
		router.Get("", handlers.GetSefer)
		router.Put("", handlers.PutSefer)
		router.Delete("", handlers.DeleteSefer)
	})

	app.Route("/sfarim/bookmark/:id", func(router fiber.Router) {
		router.Post("", handlers.BookmarkSefer)
	})

	app.Route("/users", func(router fiber.Router) {
		router.Get("/make-admin", handlers.MakeAdmin)
		router.Get("/remove-admin", handlers.RemoveAdmin)
		router.Get("/:id", handlers.GetUser)
		router.Put("/:id", handlers.UpdateUser)
	})

	app.Route("/categories", func(router fiber.Router) {
		router.Get("", handlers.ListCategories)
		router.Put("/:id", handlers.PutCategory)
		router.Post("", handlers.CreateCategory)
		router.Delete("/:id", handlers.DeleteCategory)
	})

	app.Route("/affiliations", func(router fiber.Router) {
		router.Get("/:id", handlers.GetAffiliation)
		router.Put("/:id", handlers.UpdateAffiliation)
		router.Post("", handlers.CreateAffiliation)
		router.Delete("/:id", handlers.DeleteAffiliation)
	})

	app.Get("/login", handlers.Login)
	app.Get("/logout", handlers.Logout)
	app.Get("/auth/callback", handlers.Callback)

	app.Get("/authenticate", func(c *fiber.Ctx) error {
		user, err := handlers.Authorize(c)
		log.Println("authenticate called")
		if err != nil {
			c.Status(fiber.StatusUnauthorized)
			return c.JSON(fiber.Map{
				"message": "unauthenticated",
			})
		}

		return c.JSON(user)
	})

	app.Get("/ping", func(c *fiber.Ctx) error {
		return c.SendString("pong")
	})
}
