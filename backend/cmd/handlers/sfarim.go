package handlers

import (
	"api/cmd/database"
	"api/cmd/models"
	"log"
	"strings"

	"encoding/csv"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func ListSfarim(c *fiber.Ctx) error {
	sfarim := []models.Sefer{}

	database.DB.Db.Find(&sfarim)

	return c.Status(fiber.StatusOK).JSON(sfarim)
}

func CreateSefer(c *fiber.Ctx) error {
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
	sefer := new(models.Sefer)
	if err := c.BodyParser(sefer); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
			"data":    nil,
		})
	}

	database.DB.Db.Create(&sefer)

	return c.Status(fiber.StatusOK).JSON(sefer)
}

func GetSefer(c *fiber.Ctx) error {
	id := c.Params("id")
	var sefer models.Sefer

	result := database.DB.Db.First(&sefer, id)
	if err := result.Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "fail", "message": "No sefer with that Id exists"})
		}
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(sefer)
}

func PutSefer(c *fiber.Ctx) error {
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
	var payload *models.Sefer

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	var sefer models.Sefer
	result := database.DB.Db.First(&sefer, id)
	if err := result.Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "fail", "message": "No sefer with that Id exists"})
		}
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	database.DB.Db.Model(&sefer).Updates(map[string]interface{}{
		"shelf":            payload.Shelf,
		"shelf_section":    payload.ShelfSection,
		"category":         payload.Category,
		"subcategory":      payload.Subcategory,
		"subsubcategory":   payload.Subsubcategory,
		"title":            payload.Title,
		"hebrew_title":     payload.HebrewTitle,
		"masechet_section": payload.MasechetSection,
		"volume":           payload.Volume,
		"publisher_type":   payload.PublisherType,
		"author":           payload.Author,
		"language":         payload.Language,
		"photo":            payload.Photo,
		"initial":          payload.Initial,
		"description":      payload.Description,
		"crosslist":        payload.Crosslist,
		"crosslist2":       payload.Crosslist2,
		"library":          payload.Library,
		"confirmed":        payload.Confirmed,
		"quantity":         payload.Quantity,
		"updated_at":       time.Now(),
	})
	return c.Status(fiber.StatusOK).JSON(sefer)
}

func DeleteSefer(c *fiber.Ctx) error {
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

	result := database.DB.Db.Delete(&models.Sefer{}, id)

	if result.RowsAffected == 0 {
		return c.Status(404).JSON(fiber.Map{"status": "fail", "message": "No sefer with that Id exists"})
	} else if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": result.Error})
	}

	return c.SendStatus(fiber.StatusNoContent)
}

func GenerateFromCsv(c *fiber.Ctx) error {
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

	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Error uploading file", "data": err})
	}
	if !strings.HasSuffix(strings.ToLower(file.Filename), ".csv") {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Wrong file type", "data": err})
	}
	f, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Error opening file", "data": err})
	}
	reader := csv.NewReader(f)
	records, err := reader.ReadAll()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Error reading file", "data": err})
	}

	log.Default().Println(records[0])

	return c.Status(fiber.StatusOK).JSON(records)
}
