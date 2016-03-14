package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/boltdb/bolt"
	"github.com/gorilla/securecookie"
	"github.com/gorilla/sessions"
	"golang.org/x/crypto/bcrypt"
)

var cookieStore = sessions.NewCookieStore([]byte(securecookie.GenerateRandomKey(32)))

type inMemSession struct {
	id  string
	ttd int64
}

func init() {
	cookieStore.MaxAge(3600)
}

func checkCredentials(u string, p string) (bool, error) {

	var pHashed []byte
	var err error

	db, err := bolt.Open("data.db", 0600, nil)
	if err != nil {
		return false, err
	}
	defer db.Close()

	err = db.Update(
		func(tx *bolt.Tx) error {
			b, err := tx.CreateBucketIfNotExists([]byte("users"))
			if err != nil {
				return nil
			}
			pHashed = b.Get([]byte(u))
			return nil
		},
	)
	if err != nil {
		return false, err
	}

	check := bcrypt.CompareHashAndPassword(pHashed, []byte(p))
	if check == nil {
		return true, nil
	}

	return false, err
}

// handles all requests to the login, a 200 is responded only is a valid session, and valid username and password are present in the request
func loginHandler(w http.ResponseWriter, r *http.Request) {
	// get or create a new session

	sessionIsValid, err := checkSession(w, r)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "there was a problem checking your session", http.StatusInternalServerError)
		r.Cookies()
		return
	}
	if sessionIsValid {
		// save new session cookie

		w.Write([]byte("session has been saved"))

	} else {
		r.ParseForm()
		r.ParseMultipartForm(2500)
		username := r.FormValue("username")
		fmt.Println("username from form: ", username)
		password := r.FormValue("password")
		fmt.Println("password from form: ", password)
		// check if valid
		loginIsValid, err := checkCredentials(username, password)
		if err != nil {
			http.Error(w, "there was a problem with your username or password", http.StatusInternalServerError)
			fmt.Println(err)
			return
		}
		if loginIsValid {
			session, err := cookieStore.Get(r, "session")
			if err != nil {
				http.Error(w, err.Error(), 500)
				return
			}
			session.Values["id"] = fmt.Sprint(time.Now().UnixNano())
			session.Values["username"] = username
			session.Save(r, w)
			saveToMem(session)
			w.Write([]byte("session has been saved"))
			return
		}

		http.Error(w, "you are not logged in", http.StatusUnauthorized)
		return
	}
}

func isSessIDValid(s *sessions.Session) (bool, error) {
	// get session ID
	sessID := s.Values["id"]
	if sessID == nil {
		return false, nil
	}
	isValid := false
	// is ID in database
	db, err := bolt.Open("data.db", 0600, nil)
	if err != nil {
		return false, err
	}
	defer db.Close()

	err = db.Update(
		func(tx *bolt.Tx) error {
			b, err := tx.CreateBucketIfNotExists(([]byte("sessions")))
			if err != nil {
				return err
			}
			sessIDStr, ok := sessID.(string)
			if ok {
				val := b.Get([]byte(sessIDStr))
				fmt.Println("looking for sessionID")
				fmt.Println(s.Values["id"])
				if val != nil {
					valInt, err := strconv.ParseInt(string(val), 10, 0)
					if err != nil {
						return err
					}
					if valInt > time.Now().Unix() {
						isValid = true
					}
					fmt.Println("saved time: ", valInt, "\t time now: ", time.Now().Unix())
				}
			} else {
				return errors.New("there was a problem with the id")
			}

			return nil
		},
	)
	if err != nil {
		return false, err
	}
	return isValid, nil
}

func saveToMem(s *sessions.Session) error {

	ttd := int64(s.Options.MaxAge) + time.Now().Unix()

	db, err := bolt.Open("data.db", 0600, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	fmt.Println("sessionID: ", s.Values["id"])
	// store the session in the database with the unix time when it expires
	err = db.Update(
		func(tx *bolt.Tx) error {
			b, err := tx.CreateBucketIfNotExists([]byte("sessions"))
			if err != nil {
				return fmt.Errorf("create bucket: %s", err)
			}
			b.Put([]byte(s.Values["id"].(string)), []byte(strconv.FormatInt(ttd, 10)))

			return nil
		},
	)
	if err != nil {
		return err
	}

	// take this opportunity to clean up the session store of expired sessions
	err = db.Update(
		func(tx *bolt.Tx) error {
			// Assume bucket exists and has keys
			b := tx.Bucket([]byte("sessions"))

			c := b.Cursor()

			for k, v := c.First(); k != nil; k, v = c.Next() {
				vTtd, err := strconv.ParseInt(string(v), 10, 0)
				if err != nil {
					return err
				}
				if vTtd < time.Now().Unix() {
					b.Delete(k)
				}
			}
			return nil
		},
	)
	if err != nil {
		return err
	}
	return nil

}

// checkSession determines whether a session is valid, by looking for a valid, encrypted username
func checkSession(w http.ResponseWriter, r *http.Request) (bool, error) {

	session, err := cookieStore.Get(r, "session")
	if session.IsNew && err != nil {
		// session could not be decoded so a new one was created...
		session.Save(r, w)
		return false, nil
	}
	sessionIsValid, err := isSessIDValid(session)
	if err != nil {
		return false, err
	}
	if sessionIsValid {
		session.Save(r, w)
		saveToMem(session)
		return true, nil
	}

	return false, nil
}
