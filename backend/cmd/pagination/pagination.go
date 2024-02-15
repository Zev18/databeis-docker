package pagination

import (
	"api/cmd/database"
	"math"
)

type PaginationData struct {
	CurrentPage int `json:"currentPage"`
	NextPage    int `json:"nextPage"`
	PrevPage    int `json:"prevPage"`
	TotalPages  int `json:"totalPages"`
	TotalRows   int `json:"totalRows"`
	Offset      int `json:"offset"`
}

func Paginate(page int, perPage int, model interface{}, query string, languages string, categoryIds, queryCategories []uint) PaginationData {
	var totalRows int64
	command := database.DB.Db.Model(model)
	if len(categoryIds) > 0 {
		command = command.Where("category_id IN (?) OR subcategory_id IN (?) OR subsubcategory_id IN (?)", categoryIds, categoryIds, categoryIds)
	}
	if languages != "" {
		command.Where(languages).Count(&totalRows)
	}
	if query != "" {
		command.Order("created_at DESC").Where(languages).Where("title ILIKE ? OR hebrew_title ILIKE ? OR masechet_section ILIKE ? OR publisher_type ILIKE ? OR author ILIKE ? OR description ILIKE ? OR crosslist ILIKE ? OR crosslist2 ILIKE ? OR category_id IN (?) OR subcategory_id IN (?) OR subsubcategory_id IN (?)", query, query, query, query, query, query, query, query, queryCategories, queryCategories, queryCategories).Count(&totalRows)
	}
	totalPages := math.Ceil(float64(totalRows) / float64(perPage))

	offset := (page - 1) * perPage

	return PaginationData{
		CurrentPage: page,
		NextPage:    min(int(totalPages), page+1),
		PrevPage:    max(1, page-1),
		TotalPages:  int(totalPages),
		TotalRows:   int(totalRows),
		Offset:      offset,
	}
}
