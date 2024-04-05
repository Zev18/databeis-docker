package handlers

import (
	"api/cmd/database"
	"api/cmd/models"

	"github.com/gofiber/fiber/v2"
)

type Category struct {
	Id       uint          `json:"id"`
	Name     string        `json:"name"`
	Type     string        `json:"type"`
	Children []Subcategory `json:"children,omitempty"`
}
type Subcategory struct {
	Id       uint             `json:"id"`
	Name     string           `json:"name"`
	Type     string           `json:"type"`
	Children []Subsubcategory `json:"children,omitempty"`
}
type Subsubcategory struct {
	Id   uint   `json:"id"`
	Type string `json:"type"`
	Name string `json:"name"`
}

func ListCategories(c *fiber.Ctx) error {
	var categories, subcategories, subsubcategories []models.Category
	var results []Category

	database.DB.Db.Where("type = ?", "category").Order("name ASC").Find(&categories)
	database.DB.Db.Where("type = ?", "subcategory").Order("name ASC").Find(&subcategories)
	database.DB.Db.Where("type = ?", "subsubcategory").Order("name ASC").Find(&subsubcategories)

	for _, category := range categories {
		children := []Subcategory{}
		for _, subcategory := range subcategories {
			grandchildren := []Subsubcategory{}
			for _, subsubcategory := range subsubcategories {
				if subcategory.ID == *subsubcategory.ParentID {
					grandchildren = append(grandchildren, Subsubcategory{
						Id:   subsubcategory.ID,
						Name: subsubcategory.Name,
						Type: subsubcategory.Type,
					})
				}
			}
			subcategoryResult := Subcategory{
				Id:       subcategory.ID,
				Name:     subcategory.Name,
				Type:     subcategory.Type,
				Children: grandchildren,
			}
			if category.ID == *subcategory.ParentID {
				children = append(children, subcategoryResult)
			}
		}
		results = append(results, Category{Id: category.ID, Name: category.Name, Type: category.Type, Children: children})
	}

	return c.Status(fiber.StatusOK).JSON(results)
}

func CreateCategory(c *fiber.Ctx) error {
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
	category := new(models.Category)
	if err := c.BodyParser(category); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
			"data":    nil,
		})
	}
	if category.ParentID != nil {
		if category.Type == "category" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":  "error",
				"message": "category cannot have a parent",
				"data":    nil,
			})
		}
		var parent models.Category
		database.DB.Db.First(&parent, *category.ParentID)
		if category.Type == "subcategory" && parent.Type != "category" || category.Type == "subsubcategory" && parent.Type != "subcategory" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":  "error",
				"message": "invalid inheritance",
				"data":    nil,
			})

		}
	} else if category.Type == "subcategory" || category.Type == "subsubcategory" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "subcategory must have a parent",
			"data":    nil,
		})
	}

	result := database.DB.Db.Where(models.Category{Name: category.Name, Type: category.Type, ParentID: category.ParentID}).FirstOrCreate(&category)
	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "category already exists",
			"data":    nil,
		})
	}

	return c.Status(fiber.StatusOK).JSON(category)
}

func PutCategory(c *fiber.Ctx) error {
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
	var category models.Category
	database.DB.Db.Where("id = ?", c.Params("id")).First(&category)

	newCategory := new(models.Category)
	if err := c.BodyParser(newCategory); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
			"data":    nil,
		})
	}

	category.Name = newCategory.Name
	category.Type = newCategory.Type
	category.ParentID = newCategory.ParentID

	if category.ParentID != nil {
		if category.Type == "category" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":  "error",
				"message": "category cannot have a parent",
				"data":    nil,
			})
		}
		var parent models.Category
		database.DB.Db.First(&parent, *category.ParentID)
		if category.Type == "subcategory" && parent.Type != "category" || category.Type == "subsubcategory" && parent.Type != "subcategory" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":  "error",
				"message": "invalid inheritance",
				"data":    nil,
			})

		}
	} else if category.Type == "subcategory" || category.Type == "subsubcategory" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "subcategory must have a parent",
			"data":    nil,
		})
	}

	database.DB.Db.Save(&category)

	return c.Status(fiber.StatusOK).JSON(category)
}

func DeleteCategory(c *fiber.Ctx) error {
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
	var category models.Category
	database.DB.Db.Where("id = ?", c.Params("id")).First(&category)
	database.DB.Db.Delete(&category)
	return c.Status(fiber.StatusOK).JSON(category)
}
