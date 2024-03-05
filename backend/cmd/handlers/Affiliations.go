package handlers

import (
	"api/cmd/database"
	"api/cmd/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func CreateAffiliation(c *fiber.Ctx) error {
	user, err := Authorize(c)
	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}
	if !user.IsAdmin {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthorized",
		})
	}

	var affiliation *models.Affiliation
	if err := c.BodyParser(&affiliation); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
			"data":    nil,
		})
	}

	database.DB.Db.Create(&affiliation)

	return c.Status(fiber.StatusOK).JSON(affiliation)
}

func GetAffiliation(c *fiber.Ctx) error {
	id := c.Params("id")
	var affiliation models.Affiliation

	result := database.DB.Db.First(&affiliation, id)
	if err := result.Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "fail", "message": "No affiliation with that Id exists"})
		}
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(affiliation)
}

func DeleteAffiliation(c *fiber.Ctx) error {
	user, err := Authorize(c)
	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}
	if !user.IsAdmin {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthorized",
		})
	}
	id := c.Params("id")

	result := database.DB.Db.Delete(&models.Affiliation{}, id)
	if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": result.Error})
	}

	return c.SendStatus(fiber.StatusOK)
}

func UpdateAffiliation(c *fiber.Ctx) error {
	user, err := Authorize(c)
	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}
	if !user.IsAdmin {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthorized",
		})
	}
	id := c.Params("id")
	var payload *models.Affiliation

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	var affiliation models.Affiliation
	result := database.DB.Db.First(&affiliation, id)
	if err := result.Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "fail", "message": "No affiliation with that Id exists"})
		}
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	database.DB.Db.Model(&affiliation).Updates(payload)

	return c.Status(fiber.StatusOK).JSON(affiliation)
}
