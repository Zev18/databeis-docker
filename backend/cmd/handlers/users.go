package handlers

import (
	"api/cmd/database"
	"api/cmd/models"
	"log"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func GetUser(c *fiber.Ctx) error {
	id := c.Params("id")
	var user models.User

	result := database.DB.Db.Preload("Affiliation").First(&user, id)
	if err := result.Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "fail", "message": "No user with that Id exists"})
		}
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(user)
}

func UpdateUser(c *fiber.Ctx) error {
	client, err := Authorize(c)
	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}
	if !client.IsAdmin {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthorized",
		})
	}
	id := c.Params("id")
	var payload *models.User

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	var user models.User
	result := database.DB.Db.First(&user, id)
	if err := result.Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "fail", "message": "No user with that Id exists"})
		}
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	log.Printf("%+v\n", payload)

	database.DB.Db.Model(&user).Updates(&map[string]interface{}{
		"DisplayName":     payload.DisplayName,
		"GradYear":        payload.GradYear,
	})

	if payload.Affiliation != nil {
		var affiliation models.Affiliation
		result := database.DB.Db.Where("name ILIKE ?", payload.Affiliation.Name).First(&affiliation)
		if result.Error == nil {
			database.DB.Db.Model(&user).Association("Affiliation").Replace(&affiliation)
		}
	} else {
		database.DB.Db.Model(&user).Association("Affiliation").Clear()
	}
	return c.Status(fiber.StatusOK).JSON(user)
}

func MakeAdmin(c *fiber.Ctx) error {
	client, err := Authorize(c)
	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}
	if !client.IsAdmin {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthorized",
		})
	}
	ids := strings.Split(c.Query("ids"), delimiter)

	var users []models.User
	database.DB.Db.Model(&users).Clauses(clause.Returning{}).Where("id IN ?", ids).Update("is_admin", true)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "success",
		"data":    strconv.Itoa(len(users)) + " users updated",
	})
}

func RemoveAdmin(c *fiber.Ctx) error {
	client, err := Authorize(c)
	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}
	if !client.IsAdmin {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthorized",
		})
	}
	ids := strings.Split(c.Query("ids"), delimiter)

	var users []models.User
	database.DB.Db.Model(&users).Clauses(clause.Returning{}).Where("id IN ?", ids).Update("is_admin", false)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "success",
		"data":    strconv.Itoa(len(users)) + " users updated",
	})
}
