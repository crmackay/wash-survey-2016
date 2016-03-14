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
			b, err := tx.CreateBucketIfNotExists([]byte("users"))
			if err != nil {
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

//
// err = bcrypt.CompareHashAndPassword([]byte{0x24, 0x32, 0x61, 0x24, 0x31, 0x30, 0x24, 0x32, 0x64, 0x36, 0x61, 0x41, 0x6c, 0x54, 0x57, 0x2f, 0x38, 0x30, 0x6d, 0x67, 0x36, 0x73, 0x4d, 0x55, 0x38, 0x2f, 0x67, 0x74, 0x4f, 0x4d, 0x57, 0x37, 0x4d, 0x47, 0x6d, 0x63, 0x63, 0x6d, 0x4f, 0x75, 0x56, 0x35, 0x30, 0x57, 0x6d, 0x37, 0x5a, 0x46, 0x4b, 0x41, 0x43, 0x2e, 0x2f, 0x62, 0x69, 0x6e, 0x74, 0x48, 0x47, 0x65}, []byte(p))
//
// fmt.Println(err)
//
// if err == nil {
// 	fmt.Println("compare == true")
// }
