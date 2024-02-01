package handlers

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"api/cmd/auth"
	"api/cmd/database"
	"api/cmd/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
)

const (
	delimiter = ";"
)

type UserData struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	VerifiedEmail bool   `json:"verified_email"`
	Name          string `json:"name"`
	GivenName     string `json:"given_name"`
	FamilyName    string `json:"family_name"`
	Picture       string `json:"picture"`
	Locale        string `json:"locale"`
	HD            string `json:"hd"`
}

func Login(c *fiber.Ctx) error {
	url := auth.AppConfig.GoogleLoginConfig.AuthCodeURL(os.Getenv("STATE_KEY") + delimiter + c.Get("Referer"))
	c.Status(fiber.StatusSeeOther)
	c.Redirect(url)
	return c.JSON(url)
}

func Callback(c *fiber.Ctx) error {
	stateStrs := strings.Split(c.Query("state"), delimiter)
	state := stateStrs[0]
	referer := stateStrs[1]
	log.Println(referer)
	if state != os.Getenv("STATE_KEY") {
		return c.SendString("States don't Match!!")
	}

	code := c.Query("code")

	googleConfig := auth.GoogleConfig()

	token, err := googleConfig.Exchange(context.Background(), code)
	if err != nil {
		return c.SendString("Code-Token Exchange Failed")
	}

	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		return c.SendString("User Data Fetch Failed")
	}

	userDataBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.SendString("JSON Parsing Failed")
	}

	var userData UserData
	err = json.Unmarshal(userDataBytes, &userData)
	if err != nil {
		return c.SendString("JSON Parsing Failed")
	}
	var user models.User
	if err := database.DB.Db.Where("email = ?", userData.Email).First(&user).Error; err != nil {
		// User doesn't exist, create a new User instance
		user = models.User{
			Email:       userData.Email,
			Name:        userData.Name,
			AvatarURL:   userData.Picture,
			FirstName:   userData.GivenName,
			LastName:    userData.FamilyName,
			NickName:    userData.Name,
			DisplayName: userData.Name,
		}

		// Insert the new user into the database
		if err := database.DB.Db.Create(&user).Error; err != nil {
			return c.SendString("Error inserting user into the database")
		}

	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
		ExpiresAt: time.Now().Add(time.Hour * 24 * 14).Unix(), // 2 weeks
	})

	jwtToken, jwtErr := claims.SignedString([]byte(os.Getenv("JWT_SECRET")))

	if jwtErr != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not login",
		})
	}

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    jwtToken,
		Expires:  time.Now().Add(time.Hour * 24 * 14),
		HTTPOnly: true,
	}
	c.Cookie(&cookie)

	if referer != "" {
		c.Status(fiber.StatusSeeOther)
		c.Redirect(referer)
	} else {
		c.Status(fiber.StatusOK)
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Path:     "/",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func Authorize(c *fiber.Ctx) (*models.User, error) {
	cookie := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		return nil, err
	}

	claims := token.Claims.(*jwt.StandardClaims)

	var user models.User
	err = database.DB.Db.Where("id = ?", claims.Issuer).First(&user).Error
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func WhoAmI(c *fiber.Ctx) error {
	user, err := Authorize(c)
	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}
	return c.JSON(user)
}
