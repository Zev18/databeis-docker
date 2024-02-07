package handlers

import (
	"api/cmd/database"
	"api/cmd/models"
	"api/cmd/pagination"
	"log"
	"strconv"
	"strings"

	"encoding/csv"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func ListSfarim(c *fiber.Ctx) error {
	pageStr, perPageStr, queryStr, language, categoriesStr := c.Query("page", "1"), c.Query("perPage", "10"), c.Query("query", ""), c.Query("language", "english;aramaic;hebrew"), strings.ToLower(c.Query("categories"))
	page, err := strconv.Atoi(pageStr)
	if err != nil {
		log.Println(err)
		page = 1
	}
	perPage, err := strconv.Atoi(perPageStr)
	if err != nil {
		log.Println(err)
		perPage = 10
	}

	categories := strings.Split(categoriesStr, delimiter)

	if queryStr != "" {
		queryStr = "%" + strings.TrimSpace(queryStr) + "%"
	}
	var languages []string
	if language != "" {
		languages = strings.Split(language, delimiter)
	} else {
		languages = []string{"english", "aramaic", "hebrew"}
	}
	var languagesQuery string
	for i, lang := range languages {
		if i != 0 {
			languagesQuery += " OR "
		}
		languagesQuery += "languages ILIKE " + "'%" + strings.TrimSpace(lang) + "%'"
	}

	paginationData := pagination.Paginate(page, perPage, &models.Sefer{}, queryStr, languagesQuery, categories)
	sfarim := []models.Sefer{}
	command := database.DB.Db
	if len(categories) > 0 {
		command = command.Where("LOWER(category) IN (?) OR LOWER(subcategory) IN (?) OR LOWER(subsubcategory) IN (?)", categories, categories, categories)
	}
	if queryStr == "" {
		log.Println(languages)
		command.Order("created_at DESC").Limit(perPage).Offset(paginationData.Offset).Where(languagesQuery).Find(&sfarim)
	} else {
		command.Order("created_at DESC").Limit(perPage).Offset(paginationData.Offset).Where(languagesQuery).Where("category ILIKE ? OR subcategory ILIKE ? OR subsubcategory ILIKE ? OR title ILIKE ? OR hebrew_title ILIKE ? OR masechet_section ILIKE ? OR publisher_type ILIKE ? OR author ILIKE ? OR description ILIKE ? OR crosslist ILIKE ? OR crosslist2 ILIKE ?", queryStr, queryStr, queryStr, queryStr, queryStr, queryStr, queryStr, queryStr, queryStr, queryStr, queryStr).Find(&sfarim)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data":       sfarim,
		"pagination": paginationData,
	})
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
		"languages":        strings.ToLower(*payload.Languages),
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
	if records[0][0] == "LibraryThing" {
		records = records[1:]
	}
	var newSfarim []models.Sefer

	for _, record := range records {
		languages := strings.ToLower(record[13])
		quantity, err := strconv.Atoi(record[14])
		if err != nil {
			quantity = 0
		}
		library := StrToBool(record[0])
		confirmed := StrToBool(record[1])

		newSfarim = append(newSfarim, models.Sefer{
			Shelf:           &record[2],
			ShelfSection:    &record[3],
			Category:        &record[4],
			Subcategory:     &record[5],
			Subsubcategory:  &record[6],
			Title:           record[7],
			HebrewTitle:     &record[8],
			MasechetSection: &record[9],
			Volume:          &record[10],
			PublisherType:   &record[11],
			Author:          &record[12],
			Languages:       &languages,
			Quantity:        &quantity,
			Photo:           &record[15],
			Initial:         &record[16],
			Description:     &record[17],
			Crosslist:       &record[18],
			Crosslist2:      &record[19],
			Library:         &library,
			Confirmed:       &confirmed,
		})
	}

	database.DB.Db.Create(&newSfarim)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Error reading file", "data": err})
	}

	return c.Status(fiber.StatusOK).JSON(newSfarim[0])
}

func StrToBool(str string) bool {
	if strings.ToLower(str) == "true" {
		return true
	}
	return false
}
