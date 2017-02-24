// a small command-line utility to save a password to the app database file in a secure way

package main

import (
	"fmt"
	"os"

	"github.com/boltdb/bolt"

	"golang.org/x/crypto/bcrypt"
)

func main() {

	if len(os.Args) != 3 {
		fmt.Println("there was a problem with yout input \nplease enter a username and password")
		return
	}

	u := os.Args[1]
	p := os.Args[2]

	fmt.Println("username: \t", os.Args[1])
	fmt.Println("password: \t", os.Args[2])

	storePassword(u, p)

}

func storePassword(u string, p string) error {
	pHashed, err := bcrypt.GenerateFromPassword([]byte(p), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	db, err := bolt.Open("../server/data.db", 0600, nil)
	if err != nil {
		return err
	}
	defer db.Close()

	err = db.Update(
		func(tx *bolt.Tx) error {
			b, errr := tx.CreateBucketIfNotExists([]byte("users"))
			if errr != nil {
				return err
			}
			err = b.Put([]byte(u), []byte(pHashed))
			if err != nil {
				return err
			}
			return nil
		},
	)
	return err
}
