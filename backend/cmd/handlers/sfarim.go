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
	"gorm.io/gorm/clause"
)

func ListSfarim(c *fiber.Ctx) error {
	pageStr, perPageStr, queryStr, language, categoriesStr := c.Query("page", "1"), c.Query("perPage", "25"), c.Query("query", ""), c.Query("language", "english;aramaic;hebrew"), strings.ToLower(c.Query("categories"))
	page, err := strconv.Atoi(pageStr)
	if err != nil {
		log.Println(err)
		page = 1
	}
	perPage, err := strconv.Atoi(perPageStr)
	if err != nil {
		log.Println(err)
		perPage = 25
	}

	var categoryIds []uint
	if categoriesStr != "" {
		categoryStrs := strings.Split(categoriesStr, delimiter)
		for _, categoryStr := range categoryStrs {
			categoryId, err := strconv.Atoi(categoryStr)
			if err == nil {
				categoryIds = append(categoryIds, uint(categoryId))
			}
		}
	} else {
		categoryIds = []uint{}
	}

	var queryCategories []uint

	if queryStr != "" {
		queryStr = "%" + strings.TrimSpace(queryStr) + "%"
	}
	database.DB.Db.Model(&models.Category{}).Select("id").Where("name ILIKE ?", queryStr).Find(&queryCategories)

	log.Println("Matching categories: ", queryCategories)

	var languages []string
	if language != "" {
		languages = strings.Split(language, delimiter)
	} else {
		languages = []string{"english", "aramaic", "hebrew"}
	}
	var languagesQuery = "languages IS NULL"
	for _, lang := range languages {
		languagesQuery += " OR languages ILIKE " + "'%" + strings.TrimSpace(lang) + "%'"
	}

	paginationData := pagination.Paginate(page, perPage, &models.Sefer{}, queryStr, languagesQuery, categoryIds, queryCategories)
	sfarim := []models.Sefer{}
	command := database.DB.Db.Preload("Category").Preload("Subcategory").Preload("Subsubcategory").Preload("Users")
	if len(categoryIds) > 0 {
		command = command.Where("category_id IN (?) OR subcategory_id IN (?) OR subsubcategory_id IN (?)", categoryIds, categoryIds, categoryIds)
	}
	if queryStr == "" {
		log.Println(languages)
		command.Order("created_at DESC, id").Limit(perPage).Offset(paginationData.Offset).Where(languagesQuery).Find(&sfarim)
	} else {
		command.Order("created_at DESC, id").Limit(perPage).Offset(paginationData.Offset).Where(languagesQuery).Where("title ILIKE ? OR hebrew_title ILIKE ? OR masechet_section ILIKE ? OR publisher_type ILIKE ? OR author ILIKE ? OR description ILIKE ? OR crosslist ILIKE ? OR crosslist2 ILIKE ? OR category_id IN (?) OR subcategory_id IN (?) OR subsubcategory_id IN (?)", queryStr, queryStr, queryStr, queryStr, queryStr, queryStr, queryStr, queryStr, queryCategories, queryCategories, queryCategories).Find(&sfarim)
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

	result := database.DB.Db.Preload("Users").First(&sefer, id)
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
		"shelf":             payload.Shelf,
		"shelf_section":     payload.ShelfSection,
		"category_id":       payload.CategoryID,
		"subcategory_id":    payload.SubcategoryID,
		"subsubcategory_id": payload.SubsubcategoryID,
		"title":             payload.Title,
		"hebrew_title":      payload.HebrewTitle,
		"masechet_section":  payload.MasechetSection,
		"volume":            payload.Volume,
		"publisher_type":    payload.PublisherType,
		"author":            payload.Author,
		"languages":         strings.ToLower(*payload.Languages),
		"photo":             payload.Photo,
		"initial":           payload.Initial,
		"description":       payload.Description,
		"crosslist":         payload.Crosslist,
		"crosslist2":        payload.Crosslist2,
		"library":           payload.Library,
		"confirmed":         payload.Confirmed,
		"quantity":          payload.Quantity,
		"updated_at":        time.Now(),
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

		categoryStr, subcategoryStr, subsubcategoryStr := strings.ToLower(strings.TrimSpace(record[4])), strings.ToLower(strings.TrimSpace(record[5])), strings.ToLower(strings.TrimSpace(record[6]))

		var category, subcategory, subsubcategory models.Category
		if categoryStr != "" {
			database.DB.Db.Clauses(clause.Returning{}).FirstOrCreate(&category, &models.Category{Name: categoryStr, Type: "category"})
		}
		if subcategoryStr != "" {
			database.DB.Db.Clauses(clause.Returning{}).FirstOrCreate(&subcategory, &models.Category{Name: subcategoryStr, Type: "subcategory", ParentID: &category.ID})
		}
		if subsubcategoryStr != "" {
			database.DB.Db.FirstOrCreate(&subsubcategory, &models.Category{Name: subsubcategoryStr, Type: "subsubcategory", ParentID: &subcategory.ID})
		}

		newSefer := models.Sefer{
			Shelf:           &record[2],
			ShelfSection:    &record[3],
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
			Library:         &library,
			Confirmed:       &confirmed,
		}

		if category.ID != 0 {
			newSefer.CategoryID = &category.ID
		}
		if subcategory.ID != 0 {
			newSefer.SubcategoryID = &subcategory.ID
		}
		if subsubcategory.ID != 0 {
			newSefer.SubsubcategoryID = &subsubcategory.ID
		}

		newSfarim = append(newSfarim, newSefer)
	}

	database.DB.Db.Create(&newSfarim)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Error reading file", "data": err})
	}

	return c.Status(fiber.StatusOK).JSON(newSfarim[0])
}

func BookmarkSefer(c *fiber.Ctx) error {
	// or unbookmarks sefer if already bookmarked
	user, err := Authorize(c)
	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	seferId := c.Params("id")
	if seferId == "" {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "fail", "message": "No sefer with that Id exists"})
	}
	var msg string

	notBookmarked := database.DB.Db.Model(&user).Where("id = ?", seferId).Association("Sfarim").Count() == 0
	if notBookmarked {
		var seferForReal = models.Sefer{}
		database.DB.Db.First(&seferForReal, seferId)
		database.DB.Db.Model(&user).Association("Sfarim").Append(&seferForReal)
		msg = "Added sefer of id " + seferId + " to bookmarks"
	} else {
		var seferForReal = models.Sefer{}
		database.DB.Db.First(&seferForReal, seferId)
		database.DB.Db.Model(&user).Association("Sfarim").Delete(&seferForReal)
		msg = "Removed sefer of id " + seferId + " from bookmarks"
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": msg})
}

func StrToBool(str string) bool {
	return strings.ToLower(str) == "true"
}

type CategoryStats struct {
	Name         string `json:"name"`
	Count        int64  `json:"count"`
	Type         string `json:"type"`
	EnglishCount int64  `json:"englishCount"`
	HebrewCount  int64  `json:"hebrewCount"`
	AramaicCount int64  `json:"aramaicCount"`
}

func GetSfarimStats(c *fiber.Ctx) error {
	var categories []models.Category
	database.DB.Db.Preload("Sefer").Find(&categories)

	var categoryStatsMap = make(map[uint]CategoryStats)

	for _, category := range categories {
		id := category.ID
		var count, englishCount, hebrewCount, aramaicCount int64
		var sfarim []models.Sefer

		switch category.Type {
		case "category":
			database.DB.Db.Where("category_id = ?", id).Find(&sfarim)
		case "subcategory":
			database.DB.Db.Where("subcategory_id = ?", id).Find(&sfarim)
		case "subsubcategory":
			database.DB.Db.Where("subsubcategory_id = ?", id).Find(&sfarim)
		}

		for _, sefer := range sfarim {
			languages := strings.ToLower(*sefer.Languages)
			if strings.Contains(languages, "english") {
				englishCount++
			}
			if strings.Contains(languages, "hebrew") {
				hebrewCount++
			}
			if strings.Contains(languages, "aramaic") {
				aramaicCount++
			}
		}

		count = int64(len(sfarim))
		categoryStatsMap[id] = CategoryStats{
			Name:         category.Name,
			Count:        count,
			Type:         category.Type,
			EnglishCount: englishCount,
			HebrewCount:  hebrewCount,
			AramaicCount: aramaicCount,
		}
	}

	var sfarimCount, savedCount, userCount int64
	database.DB.Db.Model(models.Sefer{}).Count(&sfarimCount)
	database.DB.Db.Raw("SELECT COUNT(*) FROM user_sfarim").Scan(&savedCount)
	database.DB.Db.Model(models.User{}).Count(&userCount)

	var users []models.User

	database.DB.Db.Preload("Affiliation").Find(&users)

	userYearsMap := make(map[int]int)
	affiliationsMap := make(map[string]int)
	var totalAdmins int

	for _, user := range users {
		if user.IsAdmin {
			totalAdmins++
		}
		if user.Affiliation != nil {
			affiliationsMap[user.Affiliation.Name]++
		} else {
			affiliationsMap["none"]++
		}
		if user.GradYear != nil {
			userYearsMap[*user.GradYear]++
		} else {
			userYearsMap[0]++
		}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"categoryStats": categoryStatsMap,
		"totalSfarim":   sfarimCount,
		"totalSaved":    savedCount,
		"totalUsers":    userCount,
		"totalAdmins":   totalAdmins,
		"userYears":     userYearsMap,
		"affiliations":  affiliationsMap,
	})
}
