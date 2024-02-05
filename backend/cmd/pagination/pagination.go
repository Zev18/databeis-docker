package pagination

import (
	"api/cmd/database"
	"math"
)

type PaginationData struct {
	CurrentPage int
	TotalPages  int
	TotalRows   int
	Offset      int
}

func Paginate(page int, perPage int, model interface{}, query string, languages []string) PaginationData {
	var totalRows int64
	command := database.DB.Db.Model(model)
	if languages != nil {
		command.Where(`(language IN ? OR language2 IN ?)`, languages, languages).Count(&totalRows)
	}
	if query != "" {
		command.Where("language IN ? OR language2 IN ?", languages, languages).Where("category ILIKE ? OR subcategory ILIKE ? OR subsubcategory ILIKE ? OR title ILIKE ? OR hebrew_title ILIKE ? OR masechet_section ILIKE ? OR publisher_type ILIKE ? OR author ILIKE ? OR description ILIKE ? OR crosslist ILIKE ? OR crosslist2 ILIKE ?", query, query, query, query, query, query, query, query, query, query, query).Count(&totalRows)
	}
	totalPages := math.Ceil(float64(totalRows) / float64(perPage))

	offset := (page - 1) * perPage

	return PaginationData{
		CurrentPage: page,
		TotalPages:  int(totalPages),
		TotalRows:   int(totalRows),
		Offset:      offset,
	}
}
