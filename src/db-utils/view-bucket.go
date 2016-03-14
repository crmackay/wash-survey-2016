package main

import (
	"fmt"
	"os"

	"github.com/boltdb/bolt"
)

func main() {

	if len(os.Args) != 2 {
		fmt.Println("there was a problem with yout input \nplease enter a a bucket name")
		return
	}

	b := os.Args[1]

	fmt.Println("bucket: \t", os.Args[1])

	printBucket(b)
}

func printBucket(b string) {

	db, err := bolt.Open("../server/data.db", 0600, nil)
	if err != nil {
		fmt.Println(err)
	}

	err = db.View(
		func(tx *bolt.Tx) error {
			// Assume bucket exists and has keys
			b := tx.Bucket([]byte(b))
			if b == nil {
				fmt.Println("bucket does not exist")
				return nil
			}
			c := b.Cursor()

			for k, v := c.First(); k != nil; k, v = c.Next() {
				fmt.Printf("key=%s, value=%s\n", k, v)
			}

			return nil
		},
	)
}
