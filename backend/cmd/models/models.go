package models

import (
	"gorm.io/gorm"
)

type Sefer struct {
	gorm.Model
	Shelf            *string   `json:"shelf" gorm:"text;default:null"`
	ShelfSection     *string   `json:"shelfSection" gorm:"text;default:null"`
	Title            string    `json:"title" gorm:"text;not null;default:null" validate:"required"`
	HebrewTitle      *string   `json:"hebrewTitle" gorm:"text;default:null"`
	MasechetSection  *string   `json:"masechetSection" gorm:"text;default:null"`
	Volume           *string   `json:"volume" gorm:"text;default:null"`
	PublisherType    *string   `json:"publisherType" gorm:"text;default:null"`
	Author           *string   `json:"author" gorm:"text;default:null"`
	Languages        *string   `json:"language" gorm:"text;default:null"`
	Photo            *string   `json:"photo" gorm:"text;default:null"`
	Initial          *string   `json:"initial" gorm:"text;default:null"`
	Description      *string   `json:"description" gorm:"text;default:null"`
	Crosslist        *string   `json:"crosslist" gorm:"text;default:null"`
	Crosslist2       *string   `json:"crosslist2" gorm:"text;default:null"`
	Library          *bool     `json:"library" gorm:"default:null"`
	Confirmed        *bool     `json:"confirmed" gorm:"default:null"`
	Quantity         *int      `json:"quantity" gorm:"default:null"`
	CategoryID       *uint     `json:"categoryId" gorm:"default:null"`
	SubcategoryID    *uint     `json:"subcategoryId" gorm:"default:null"`
	SubsubcategoryID *uint     `json:"subsubcategoryId" gorm:"default:null"`
	Category         *Category `gorm:"foreignKey:CategoryID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;default:null" json:"category"`
	Subcategory      *Category `gorm:"foreignKey:SubcategoryID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;default:null" json:"subcategory"`
	Subsubcategory   *Category `gorm:"foreignKey:SubsubcategoryID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;default:null" json:"subsubcategory"`
	Users            []*User   `json:"users" gorm:"many2many:user_sfarim;"`
}

type Category struct {
	gorm.Model
	Name     string    `json:"name" gorm:"primaryKey;text;default:null"`
	Type     string    `json:"type" gorm:"primaryKey;text;default:null"`
	ParentID *uint     `json:"parentId" gorm:"primaryKey;default:null"`
	Parent   *Category `gorm:"foreignKey:ParentID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;default:null" json:"parent"`
}

type User struct {
	gorm.Model
	Email       string   `json:"email" gorm:"text;uniqueIndex;default:null"`
	Name        string   `json:"name" gorm:"text;default:null"`
	FirstName   string   `json:"firstName" gorm:"text;default:null"`
	LastName    string   `json:"lastName" gorm:"text;default:null"`
	NickName    string   `json:"nickName" gorm:"text;default:null"`
	DisplayName string   `json:"displayName" gorm:"text;default:null"`
	AvatarURL   string   `json:"avatarUrl" gorm:"text;default:null"`
	IsAdmin     bool     `json:"isAdmin" gorm:"default:false"`
	Sfarim      []*Sefer `json:"sfarim" gorm:"many2many:user_sfarim;"`
}
